import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import os from 'os';

/**
 * Create a PDF and open it in the default browser
 */
async function createAndOpenPdf() {
  try {
    // Create a new document
    const doc = new jsPDF();
    
    // Add content
    doc.text('Financial Report Test', 105, 20, { align: 'center' });
    doc.text('This is a test PDF file', 105, 30, { align: 'center' });
    
    // Save the PDF to a temporary file
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, 'financial-report.pdf');
    
    // Get the PDF as binary data
    const pdfOutput = doc.output();
    fs.writeFileSync(filePath, Buffer.from(pdfOutput, 'binary'));
    
    console.log(`PDF saved to temporary location: ${filePath}`);
    
    // Open the PDF in the default application
    let command = '';
    switch (process.platform) {
      case 'darwin': // macOS
        command = `open "${filePath}"`;
        break;
      case 'win32': // Windows
        command = `start "" "${filePath}"`;
        break;
      default: // Linux and others
        command = `xdg-open "${filePath}"`;
    }
    
    console.log('Opening PDF...');
    exec(command, (error) => {
      if (error) {
        console.error(`Error opening PDF: ${error}`);
      }
    });
  } catch (error) {
    console.error('Error creating PDF:', error);
  }
}

// Run the function
createAndOpenPdf().catch(console.error); 