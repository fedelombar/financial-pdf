import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { ChartConfig } from '../types/chart';

interface ChartComponentProps {
  /**
   * Chart configuration
   */
  config: ChartConfig;
  /**
   * Height of the chart
   */
  height?: string | number;
  /**
   * Width of the chart
   */
  width?: string | number;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Callback when chart is ready
   */
  onChartReady?: (chart: Chart) => void;
}

/**
 * Chart component for rendering charts in Next.js
 */
const ChartComponent: React.FC<ChartComponentProps> = ({
  config,
  height = '400px',
  width = '100%',
  className = '',
  onChartReady
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Clean up any existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // Create new chart
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: config.type,
          data: config.data,
          options: config.options
        });
        
        // Call onChartReady callback if provided
        if (onChartReady && chartInstance.current) {
          onChartReady(chartInstance.current);
        }
      }
    }

    // Clean up on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [config, onChartReady]);

  return (
    <div
      className={`financial-chart-container ${className}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartComponent; 