import { createBarChart, createStackedBarChart } from '../../src/charts/bar-chart';
import { createLineChart } from '../../src/charts/line-chart';
import { createPieChart } from '../../src/charts/pie-chart';

/**
 * Simple test without PDF export
 */
function simpleTest() {
  console.log("Testing chart creation...");
  
  // Test bar chart
  const barChart = createBarChart(
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    [10, 20, 15, 25, 30, 28]
  );
  console.log("Bar chart created:", barChart.type);
  
  // Test line chart
  const lineChart = createLineChart(
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    [10, 20, 15, 25, 30, 28]
  );
  console.log("Line chart created:", lineChart.type);
  
  // Test pie chart
  const pieChart = createPieChart(
    ['Category A', 'Category B', 'Category C', 'Category D'],
    [30, 50, 20, 40]
  );
  console.log("Pie chart created:", pieChart.type);
  
  // Test stacked bar chart
  const stackedBarChart = createStackedBarChart(
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    [
      [10, 20, 15, 25, 30, 28], // Dataset 1
      [5, 15, 10, 20, 25, 30]    // Dataset 2
    ],
    ['Revenue', 'Expenses']
  );
  console.log("Stacked bar chart created:", stackedBarChart.type);
  
  console.log("All tests passed!");
}

// Run the test
simpleTest(); 