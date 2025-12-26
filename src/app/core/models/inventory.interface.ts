export interface InventoryItem {
  iD?: number;
  productName: string;
  brand: string;
  inventoryMasterId: number;
  availableSizes?: string;
  availableColour?: string;
  prices: number;
  isReturnAcceptable: boolean;
  isAvailableOnRent: boolean;
  productImages?: string;
  comboDetails?: string;
  description?: string;
  fabricMaterial?: string;
  status: 'Active' | 'Inactive';
  category: 'M' | 'W' | 'Kids';
  availableOnline: boolean;
}