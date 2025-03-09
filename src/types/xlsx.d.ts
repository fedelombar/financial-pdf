/**
 * Type declaration for xlsx
 */

declare module 'xlsx' {
  // Simple minimal typings
  export interface WorkBook {
    SheetNames: string[];
    Sheets: { [sheet: string]: WorkSheet };
    Props?: any;
  }

  export interface WorkSheet {
    [cell: string]: any;
    '!ref'?: string;
    '!cols'?: any[];
  }
  
  export namespace utils {
    function book_new(): WorkBook;
    function book_append_sheet(workbook: WorkBook, worksheet: WorkSheet, name: string): void;
    function aoa_to_sheet(data: any[][]): WorkSheet;
    function json_to_sheet(data: any[]): WorkSheet;
    function decode_range(range: string): { s: {c: number, r: number}, e: {c: number, r: number} };
    function encode_cell(cell: {c: number, r: number}): string;
  }
  
  export function write(workbook: WorkBook, options: { bookType: string, type: string }): any;
} 