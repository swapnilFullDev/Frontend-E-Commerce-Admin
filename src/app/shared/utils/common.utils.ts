export class CommonUtils {
  
  static getVariantPrices(variants: any[]): string {
    return variants?.map(v => `₹${v.price}`).join(', ') || '₹0';
  }

  static getVariantSizes(variants: any[]): string {
    return variants?.map(v => v.size).join(', ') || '--';
  }

  static getVariantColors(variants: any[]): string {
    return variants?.map(v => v.color).join(', ') || '--';
  }

  static formatCurrency(amount: number): string {
    return `₹${amount}`;
  }

  static joinArray(array: any[], property?: string): string {
    if (!array || array.length === 0) return '--';
    return property ? array.map(item => item[property]).join(', ') : array.join(', ');
  }
}