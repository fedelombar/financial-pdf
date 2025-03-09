import { jsPDF } from 'jspdf';
import fs from 'fs';

/**
 * Create a basic PDF file as a test
 */
async function createBasicPdf() {
  try {
    // Create a new document
    const doc = new jsPDF();
    
    // Add some text
    doc.text('Financial Report Test', 105, 20, { align: 'center' });
    doc.text('This is a test PDF file', 105, 30, { align: 'center' });
    doc.text('Created with jsPDF', 105, 40, { align: 'center' });
    
    // Add a simple table
    doc.text('Revenue Overview', 20, 60);
    
    const headers = ['Month', 'Revenue', 'Expenses', 'Profit'];
    const data = [
      ['January', '$10,000', '$7,000', '$3,000'],
      ['February', '$12,000', '$7,500', '$4,500'],
      ['March', '$15,000', '$8,000', '$7,000'],
    ];
    
    // Draw table headers
    headers.forEach((header, i) => {
      doc.text(header, 20 + (i * 40), 70);
    });
    
    // Draw table data
    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        doc.text(cell, 20 + (colIndex * 40), 80 + (rowIndex * 10));
      });
    });
    
    // Save the PDF
    const pdfOutput = doc.output();
    fs.writeFileSync('basic-report.pdf', Buffer.from(pdfOutput, 'binary'));
    
    console.log('Basic PDF created successfully: basic-report.pdf');
  } catch (error) {
    console.error('Error creating PDF:', error);
  }
}

// Run the function
createBasicPdf().catch(console.error); 