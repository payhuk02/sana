import { supabase } from './supabase';
import { logger } from './logger';

export interface Customer {
  id: string; // email utilisé comme ID unique
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
  addresses: Array<{
    street: string;
    city: string;
    postal_code: string;
    country: string;
  }>;
}

/**
 * Récupère tous les clients uniques depuis les commandes
 */
export async function getAllCustomers(): Promise<Customer[]> {
  try {
    // Récupérer toutes les commandes
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching orders for customers', error, 'customers');
      return [];
    }

    if (!orders || orders.length === 0) {
      return [];
    }

    // Grouper les commandes par email (client unique)
    const customersMap = new Map<string, Customer>();

    orders.forEach((order) => {
      const email = order.customer_email;
      
      if (!customersMap.has(email)) {
        // Nouveau client
        customersMap.set(email, {
          id: email,
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          totalOrders: 1,
          totalSpent: order.total || 0,
          firstOrderDate: order.created_at,
          lastOrderDate: order.created_at,
          addresses: [order.shipping_address],
        });
      } else {
        // Client existant, mettre à jour les stats
        const customer = customersMap.get(email)!;
        customer.totalOrders += 1;
        customer.totalSpent += order.total || 0;
        
        // Mettre à jour les dates
        if (new Date(order.created_at) < new Date(customer.firstOrderDate)) {
          customer.firstOrderDate = order.created_at;
        }
        if (new Date(order.created_at) > new Date(customer.lastOrderDate)) {
          customer.lastOrderDate = order.created_at;
        }
        
        // Ajouter l'adresse si elle n'existe pas déjà
        const addressExists = customer.addresses.some(
          (addr) =>
            addr.street === order.shipping_address.street &&
            addr.city === order.shipping_address.city &&
            addr.postal_code === order.shipping_address.postal_code
        );
        
        if (!addressExists) {
          customer.addresses.push(order.shipping_address);
        }
      }
    });

    // Convertir la Map en tableau et trier par nombre de commandes (décroissant)
    return Array.from(customersMap.values()).sort(
      (a, b) => b.totalOrders - a.totalOrders
    );
  } catch (error) {
    logger.error('Error processing customers', error, 'customers');
    return [];
  }
}

/**
 * Récupère les commandes d'un client spécifique
 */
export async function getCustomerOrders(customerEmail: string) {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', customerEmail)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching customer orders', error, 'customers');
      return [];
    }

    return orders || [];
  } catch (error) {
    logger.error('Error getting customer orders', error, 'customers');
    return [];
  }
}

