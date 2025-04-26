export interface BlockBase { type: string; }

export interface TextBlock extends BlockBase {
  type: 'text';
  content: string;
  style?: 'paragraph' | 'subSubheading';
}

export interface ListBlock extends BlockBase {
  type: 'list';
  items: string[];
}

export interface BarChartBlock extends BlockBase {
  type: 'bar';
  data: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  width: number;
  height: number;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  chartConfig: any;
  style?: any;
  fromZero?: boolean;
}

export interface PieChartBlock extends BlockBase {
  type: 'pie';
  data: any[];
  width: number;
  height: number;
  chartConfig: any;
  accessor: string;
  backgroundColor?: string;
  paddingLeft?: string;
  absolute?: boolean;
}

export type Block = TextBlock | ListBlock | BarChartBlock | PieChartBlock;

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}
