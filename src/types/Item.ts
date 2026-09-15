export type ItemType = 'lost' | 'found';
export type ItemStatus = 'open' | 'claimed' | 'resolved';

export interface Item {
  id: string;
  itemName: string;
  category: string;
  type: ItemType;
  status: ItemStatus;
  date: string;
  description: string;
  imageUrl: string;
  location: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  createdAt?: number;
}

// Shape used while a form is being filled out, before an id/createdAt exist
export type ItemDraft = Omit<Item, 'id' | 'createdAt'>;

export const ITEM_CATEGORIES = [
  'Bags',
  'Electronics',
  'Documents / IDs',
  'Keys',
  'Clothing',
  'Accessories',
  'Books',
  'Other',
] as const;