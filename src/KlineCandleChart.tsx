import { useEffect, useState } from "react";
import { init, dispose } from "klinecharts";
import { getRndInteger } from "./functions";

const mockData = [
  {
    close: 4976.16,
    high: 4977.99,
    low: 4970.12,
    open: 4972.89,
    timestamp: 1587660000000,
    volume: 204,
  },
];

const percentage = (num: number, per: number) => (num / 100) * per;

const KlineCharts = () => {
  const [data, setData] = useState(mockData);

  const pushRandomData = (mockData) => {
    const data = [...mockData];
    const lastItem = data.at(-1);
    const close = lastItem.close;
    const newOpen = close || 1;
    const newHigh = getRndInteger(newOpen, newOpen + percentage(newOpen, 5));
    const newLow = getRndInteger(newOpen - percentage(newOpen, 5), newOpen);
    const newClose = getRndInteger(
      newOpen + percentage(newOpen, 5),
      newOpen - percentage(newOpen, 5)
    );
    const newRandomCandleData = {
      close: newClose,
      high: newHigh,
      low: newLow,
      open: newOpen,
      timestamp: lastItem.timestamp + 20000,
      volume: 204,
    };

    data.push(newRandomCandleData);
    return data;
  };

  useEffect(() => {
    const chart = init("chart");
    chart.applyNewData(data);

    const interval = setInterval(() => {
      setData((prev) => pushRandomData(prev));
    }, 5000);

    return () => {
      dispose("chart");
      clearInterval(interval);
    };
  }, []);

  return <div id="chart" className="flex-1" />;
};

export default KlineCharts;
