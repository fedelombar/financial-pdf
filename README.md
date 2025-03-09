# Next PDF (financial reports)

A Node.js package for generating financial reports with charts and bank reconciliations that can be easily integrated into Next.js applications.

## Features

- Generate financial reports with customizable templates
- Create interactive charts and visualizations
- Perform automated bank reconciliations
- Export reports to various formats (PDF, CSV, Excel)
- Seamlessly integrate with Next.js applications

## Installation

```bash
npm install next-pdf
```

## Quick Start

### Basic Report Generation

```typescript
import { createSimpleReport, exportReportToPdf } from 'financial-reports';

// Create a simple report
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
```

### Creating Charts

```typescript
import { createBarChart, createLineChart } from 'financial-reports';

// Create a bar chart
const barChart = createBarChart(
  ['January', 'February', 'March'], 
  [10000, 12000, 15000],
  {
    title: {
      display: true,
      text: 'Monthly Revenue'
    }
  }
);

// Create a line chart with multiple datasets
const lineChart = createLineChart(
  ['January', 'February', 'March'],
  [
    [10000, 12000, 15000], // Revenue
    [7000, 7500, 8000]     // Expenses
  ],
  {
    title: {
      display: true,
      text: 'Revenue vs Expenses'
    }
  }
);
```

### Bank Reconciliation

```typescript
import { processReconciliation } from 'financial-reports';

// Process reconciliation
const reconciliationData = {
  account: {
    name: 'Business Checking',
    number: '1234567890',
    currency: 'USD',
    openingBalance: 5000,
    closingBalance: 8500
  },
  period: {
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-01-31')
  },
  bankTransactions: [
    /* Bank transactions */
  ],
  bookTransactions: [
    /* Book transactions */
  ],
  settings: {
    fuzzyMatching: true,
    fuzzyThreshold: 0.7
  }
};

const matchResults = processReconciliation(reconciliationData);
```

### Integration with Next.js

```tsx
import { ChartComponent } from 'financial-reports/components';
import { createBarChart } from 'financial-reports';

function DashboardPage() {
  const chartConfig = createBarChart(
    ['January', 'February', 'March'], 
    [10000, 12000, 15000]
  );

  return (
    <div>
      <h1>Financial Dashboard</h1>
      <ChartComponent config={chartConfig} height={400} />
    </div>
  );
}
```

## API Reference

### Core Modules

- `createSimpleReport`: Create a basic financial report
- `generateReport`: Generate a customizable financial report
- `exportReportToPdf`: Export a report to PDF
- `exportReportToCsv`: Export a report to CSV
- `exportReportToExcel`: Export a report to Excel

### Chart Functions

- `createBarChart`: Create a bar chart
- `createStackedBarChart`: Create a stacked bar chart
- `createHorizontalBarChart`: Create a horizontal bar chart
- `createLineChart`: Create a line chart
- `createAreaChart`: Create an area chart
- `createPieChart`: Create a pie chart
- `createDoughnutChart`: Create a doughnut chart

### Reconciliation Functions

- `processReconciliation`: Process bank reconciliation
- `matchTransactions`: Match bank and book transactions
- `calculateReconciliationSummary`: Calculate reconciliation summary

### Utility Functions

- `formatCurrency`: Format a number as currency
- `formatNumber`: Format a number with custom options
- `formatDate`: Format a date with custom options
- `calculatePercentageChange`: Calculate percentage change

## Configuration

The package can be configured using the `FinancialReportsConfig` interface:

```typescript
import { FinancialReportsConfig } from 'financial-reports';

const config: FinancialReportsConfig = {
  theme: {
    primaryColor: '#3f51b5',
    secondaryColor: '#f50057',
    fontFamily: 'Arial, sans-serif'
  },
  defaultChartOptions: {
    responsive: true,
    maintainAspectRatio: false
  },
  locale: {
    language: 'en-US',
    dateFormat: 'YYYY-MM-DD',
    currencyFormat: {
      code: 'USD',
      symbol: '$',
      symbolPosition: 'before'
    }
  }
};
```

## Documentation

For more detailed documentation, check out the [official documentation](https://github.com/fedelombar/next-pdf).

## License

MIT

