import { supabase } from './supabase';
import { Order, CreateOrderData, OrderStatus } from '@/types/order';
import { logger } from './logger';

/**
 * Génère un numéro de commande unique
 */
function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `CMD-${timestamp}-${random}`;
}

/**
 * Vérifie et réduit le stock de manière atomique pour éviter les race conditions
 * Utilise une mise à jour conditionnelle avec vérification du stock
 */
async function updateStockAtomically(
  productId: string,
  quantity: number
): Promise<{ success: boolean; originalStock: number; newStock: number }> {
  try {
    // Récupérer le stock actuel
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      logger.error('Error fetching product stock', fetchError, 'orders');
      return { success: false, originalStock: 0, newStock: 0 };
    }

    const originalStock = product.stock;

    // Vérifier si le stock est suffisant
    if (originalStock < quantity) {
      return { success: false, originalStock, newStock: originalStock };
    }

    const newStock = originalStock - quantity;

    // Mettre à jour le stock de manière conditionnelle
    // Cette requête échouera si le stock a changé entre-temps
    const { data: updated, error: updateError } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', productId)
      .eq('stock', originalStock) // Condition : le stock n'a pas changé
      .select('stock')
      .single();

    if (updateError || !updated) {
      // Le stock a été modifié entre-temps (race condition détectée)
      logger.warn('Stock update conflict detected', { productId, quantity, originalStock }, 'orders');
      return { success: false, originalStock, newStock: originalStock };
    }

    return { success: true, originalStock, newStock: updated.stock };
  } catch (error) {
    logger.error('Error in atomic stock update', error, 'orders');
    return { success: false, originalStock: 0, newStock: 0 };
  }
}

/**
 * Crée une nouvelle commande dans Supabase avec gestion des race conditions de stock
 */
export async function createOrder(orderData: CreateOrderData): Promise<Order> {
  try {
    // Étape 1: Vérifier et réserver le stock de manière atomique pour tous les produits
    const stockUpdates: Array<{ productId: string; quantity: number; success: boolean; originalStock: number; newStock: number }> = [];
    
    for (const item of orderData.items) {
      const result = await updateStockAtomically(item.product_id, item.quantity);
      stockUpdates.push({
        productId: item.product_id,
        quantity: item.quantity,
        success: result.success,
        originalStock: result.originalStock,
        newStock: result.newStock,
      });

      if (!result.success) {
        // Annuler toutes les réservations précédentes en restaurant le stock
        for (const update of stockUpdates) {
          if (update.success) {
            await supabase
              .from('products')
              .update({ stock: update.originalStock })
              .eq('id', update.productId);
          }
        }
        
        throw new Error(
          `Stock insuffisant pour le produit ${item.product_id}. Stock disponible: ${result.originalStock}`
        );
      }
    }

    // Étape 2: Si tous les stocks sont réservés, créer la commande
    const orderNumber = generateOrderNumber();
    
    // Calculer les totaux
    const subtotal = orderData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.2; // TVA 20%
    const shippingCost = 0; // Livraison gratuite
    const total = subtotal + tax + shippingCost;

    // Créer la commande principale
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          customer_email: orderData.customer_email,
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          shipping_address: orderData.shipping_address,
          payment_method: orderData.payment_method,
          payment_status: 'pending',
          status: 'pending',
          subtotal,
          tax,
          shipping_cost: shippingCost,
          total,
        },
      ])
      .select()
      .single();

    if (orderError) {
      logger.error('Error creating order', orderError, 'orders');
      // Annuler les réservations de stock en restaurant le stock
      for (const update of stockUpdates) {
        if (update.success) {
          await supabase
            .from('products')
            .update({ stock: update.originalStock })
            .eq('id', update.productId);
        }
      }
      throw orderError;
    }

    // Créer les items de commande
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      logger.error('Error creating order items', itemsError, 'orders');
      // Supprimer la commande et restaurer le stock
      await supabase.from('orders').delete().eq('id', order.id);
      for (const update of stockUpdates) {
        if (update.success) {
          await supabase
            .from('products')
            .update({ stock: update.originalStock })
            .eq('id', update.productId);
        }
      }
      throw itemsError;
    }

    // Récupérer la commande complète avec les items
    const fullOrder = await getOrderById(order.id);
    if (!fullOrder) {
      throw new Error('Failed to retrieve created order');
    }

    return fullOrder;
  } catch (error) {
    logger.error('Failed to create order', error, 'orders');
    throw error;
  }
}

/**
 * Récupère une commande par son ID avec ses items
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, order_number, customer_email, customer_name, customer_phone, shipping_address, payment_method, payment_status, status, subtotal, tax, shipping_cost, total, notes, created_at, updated_at')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return null;
    }

    // Récupérer les items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products (
          id,
          name,
          image
        )
      `)
      .eq('order_id', orderId);

    if (itemsError) {
      logger.error('Error fetching order items', itemsError, 'orders');
    }

    const orderItems = (items || []).map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      product_name: item.products?.name || 'Produit supprimé',
      product_image: item.products?.image || '',
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    }));

    return {
      ...order,
      items: orderItems,
    } as Order;
  } catch (error) {
    logger.error('Error fetching order', error, 'orders');
    return null;
  }
}

/**
 * Récupère toutes les commandes (pour admin)
 */
export async function getAllOrders(): Promise<Order[]> {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, order_number, customer_email, customer_name, customer_phone, shipping_address, payment_method, payment_status, status, subtotal, tax, shipping_cost, total, notes, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching orders', error, 'orders');
      return [];
    }

    // Pour chaque commande, récupérer les items
    const ordersWithItems = await Promise.all(
      (orders || []).map(async (order) => {
        const { data: items } = await supabase
          .from('order_items')
          .select(`
            *,
            products (
              id,
              name,
              image
            )
          `)
          .eq('order_id', order.id);

        const orderItems = (items || []).map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.products?.name || 'Produit supprimé',
          product_image: item.products?.image || '',
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        }));

        return {
          ...order,
          items: orderItems,
        } as Order;
      })
    );

    return ordersWithItems;
  } catch (error) {
    logger.error('Error fetching all orders', error, 'orders');
    return [];
  }
}

/**
 * Met à jour le statut d'une commande
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      logger.error('Error updating order status', error, 'orders');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Failed to update order status', error, 'orders');
    return false;
  }
}

/**
 * Met à jour les notes d'une commande
 */
export async function updateOrderNotes(
  orderId: string,
  notes: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ notes, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      logger.error('Error updating order notes', error, 'orders');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Failed to update order notes', error, 'orders');
    return false;
  }
}

/**
 * Récupère les statistiques des commandes
 */
export async function getOrderStats() {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('status, total, created_at');

    if (error) {
      logger.error('Error fetching order stats', error, 'orders');
      return {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        paidOrders: 0,
        deliveredOrders: 0,
      };
    }

    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const pendingOrders = orders?.filter((o) => o.status === 'pending').length || 0;
    const paidOrders = orders?.filter((o) => o.status === 'paid' || o.status === 'processing' || o.status === 'shipped' || o.status === 'delivered').length || 0;
    const deliveredOrders = orders?.filter((o) => o.status === 'delivered').length || 0;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      paidOrders,
      deliveredOrders,
    };
  } catch (error) {
    logger.error('Error calculating order stats', error, 'orders');
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      paidOrders: 0,
      deliveredOrders: 0,
    };
  }
}

/**
 * Récupère les données pour les graphiques (revenus par jour sur 7 jours)
 */
export async function getRevenueChartData() {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total, created_at')
      .order('created_at', { ascending: false })
      .limit(100); // Dernières 100 commandes pour calculer les 7 derniers jours

    if (error) {
      logger.error('Error fetching revenue chart data', error, 'orders');
      return [];
    }

    // Grouper par jour sur les 7 derniers jours
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    const revenueByDay = last7Days.map(date => {
      const dayStart = date.toISOString();
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      const dayEndISO = dayEnd.toISOString();

      const dayOrders = orders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= date && orderDate <= dayEnd;
      }) || [];

      const revenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);

      return {
        date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
        revenue: Math.round(revenue),
      };
    });

    return revenueByDay;
  } catch (error) {
    logger.error('Error calculating revenue chart data', error, 'orders');
    return [];
  }
}

/**
 * Récupère les données pour le graphique de répartition des statuts
 */
export async function getStatusDistributionData() {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('status');

    if (error) {
      logger.error('Error fetching status distribution data', error, 'orders');
      return [];
    }

    const statusCounts: Record<string, number> = {};
    orders?.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    const statusLabels: Record<string, string> = {
      pending: 'En attente',
      paid: 'Payée',
      processing: 'En traitement',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count,
      status,
    }));
  } catch (error) {
    logger.error('Error calculating status distribution data', error, 'orders');
    return [];
  }
}

