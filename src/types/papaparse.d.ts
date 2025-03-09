/**
 * Type declaration for papaparse
 */

declare module 'papaparse' {
  // Simple minimal typings
  export function unparse(data: any[][], config?: any): string;
  export function parse(data: string, config?: any): any;
} 