export interface ChartData {
    name: string;
    value: number;
    [key: string]: string | number;
  }
  
  export interface ChartConfig {
    [key: string]: {
      label: string;
      color: string;
    };
  }
  
  export interface ChartProps {
    data: ChartData[];
    config: ChartConfig;
    title: string;
    className?: string;
  }