export type CandleData = {
  x: Date;
  y: number[];
};

export type ChartData = {
  data: CandleData[];
};
