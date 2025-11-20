import { supabase } from './supabase';
import { logger } from './logger';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export interface CreateContactMessageData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Crée un nouveau message de contact
 */
export async function createContactMessage(
  data: CreateContactMessageData
): Promise<ContactMessage> {
  try {
    const { data: message, error } = await supabase
      .from('contact_messages')
      .insert([data])
      .select()
      .single();

    if (error) {
      logger.error('Error creating contact message', error, 'contact');
      throw error;
    }

    return message;
  } catch (error) {
    logger.error('Failed to create contact message', error, 'contact');
    throw error;
  }
}

/**
 * Récupère tous les messages de contact (admin uniquement)
 */
export async function getAllContactMessages(): Promise<ContactMessage[]> {
  try {
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching contact messages', error, 'contact');
      return [];
    }

    return messages || [];
  } catch (error) {
    logger.error('Error fetching contact messages', error, 'contact');
    return [];
  }
}

/**
 * Met à jour le statut d'un message
 */
export async function updateContactMessageStatus(
  messageId: string,
  status: ContactMessage['status']
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', messageId);

    if (error) {
      logger.error('Error updating contact message status', error, 'contact');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Failed to update contact message status', error, 'contact');
    return false;
  }
}

