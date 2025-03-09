import { createSimpleReport, exportReportToPdf } from '../../src';

describe('Report Generation', () => {
  test('can create a simple report', () => {
    const report = createSimpleReport('Test Report', [
      {
        title: 'Summary',
        type: 'summary',
        content: {
          items: [
            { label: 'Total Revenue', value: 50000 }
          ]
        }
      }
    ]);
    
    expect(report).toHaveProperty('title', 'Test Report');
    expect(report.sections).toHaveLength(1);
  });
});