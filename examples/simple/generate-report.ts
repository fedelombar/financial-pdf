// examples/simple/generate-report.ts
import { createSimpleReport, exportReportToPdf } from '../../src';
import fs from 'fs';

async function generateSampleReport() {
  // Create sample report
  const report = createSimpleReport('Financial Summary', [
    {
      title: 'Revenue Overview',
      type: 'table',
      content: {
        headers: ['Month', 'Revenue', 'Expenses', 'Profit'],
        rows: [
          ['January', 10000, 7000, 3000],
          ['February', 12000, 7500, 4500],
          ['March', 15000, 8000, 7000],
        ],
        summary: ['Total', 37000, 22500, 14500]
      }
    }
  ]);

  // Export to PDF
  const pdfBlob = await exportReportToPdf(report);
  
  // Save the PDF
  const buffer = await pdfBlob.arrayBuffer();
  fs.writeFileSync('sample-report.pdf', Buffer.from(buffer));
  
  console.log('Report generated successfully: sample-report.pdf');
}

generateSampleReport().catch(console.error);