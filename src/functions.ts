import { CANDLE_INTERVAL, mockData } from "./constants";

export function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const percentage = (num: number, per: number) => (num / 100) * per;

export const getRandomChartData = (count: number) => {
  const data = mockData;
  for (let i = 0; i < count; i++) {
    const lastItem = data.at(-1);
    const close = lastItem!.y[3];
    const newOpen = close || 1;
    const diff = Math.ceil(percentage(newOpen, 30));
    const newHigh = getRndInteger(newOpen + 1, newOpen + diff);
    const newLow = getRndInteger(newOpen - diff, newOpen);

    const newClose = getRndInteger(newLow, newHigh);
    const newRandomCandleData = {
      x: new Date(lastItem!.x.getTime() + CANDLE_INTERVAL),
      y: [newOpen, newHigh, newLow, newClose],
    };
    data.push(newRandomCandleData);
  }
  return [{ data }];
};
