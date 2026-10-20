export type ContactCategory = 'CLIENT' | 'PARTNER' | 'TEAM' | 'LEAD' | 'VENDOR';

export interface Contact {
  id: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  category: ContactCategory;
}

export type ContactRequest = Omit<Contact, 'id'>;