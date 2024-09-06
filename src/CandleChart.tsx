import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { percentage } from "./functions";

const CANDLE_INTERVAL = 1000; // 10 seconds for each candlestick
const CANDLES_VISIBLE = 20;

const getRandomChartData = (count: number) => {
  const data = [
    {
      x: new Date(1538778640000),
      y: [43, 56, 48, 50],
    },
    {
      x: new Date(1538778660000),
      y: [50, 60, 40, 55],
    },
  ];
  for (let i = 0; i < count; i++) {
    const lastItem = data.at(-1);
    const close = lastItem.y[3];
    const newOpen = close || 1;
    const diff = Math.ceil(percentage(newOpen, 30));
    const newHigh = getRndInteger(newOpen + 1, newOpen + diff);
    const newLow = getRndInteger(newOpen - diff, newOpen);

    const newClose = getRndInteger(newLow, newHigh);
    const newRandomCandleData = {
      x: new Date(lastItem.x.getTime() + CANDLE_INTERVAL),
      y: [newOpen, newHigh, newLow, newClose],
    };
    data.push(newRandomCandleData);
  }
  return [{ data }];
};

const options: ApexOptions = {
  chart: {
    type: "candlestick",
  },
  title: {
    text: "CandleStick Chart",
    align: "left",
  },
  xaxis: {
    type: "datetime",
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  },
};

function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function CandleChart() {
  const [series, setSeries] = useState(getRandomChartData(20));
  const [isTapped, setIsTapped] = useState(false);
  const [chartRange, setChartRange] = useState({
    min: series[0].data.at(-1).x.getTime() - CANDLE_INTERVAL * CANDLES_VISIBLE,
    max: series[0].data.at(-1).x.getTime(),
  });

  const getRandomData = (prevSeries, tapped: boolean) => {
    const newSeries = [...prevSeries[0].data];
    const lastItem = newSeries.at(-1);
    const close = lastItem.y[3];
    const newOpen = close || 1;
    const diff = Math.ceil(percentage(newOpen, 30));
    const newHigh = getRndInteger(newOpen + 1, newOpen + diff);
    const newLow = getRndInteger(newOpen - diff, newOpen);

    const newClose = tapped
      ? getRndInteger(newOpen, newHigh)
      : getRndInteger(newOpen, newLow);
    const newRandomCandleData = {
      x: new Date(lastItem.x.getTime() + CANDLE_INTERVAL),
      y: [newOpen, newHigh, newLow, newClose],
    };
    newSeries.push(newRandomCandleData);
    if (isTapped) setIsTapped(false);
    return [{ data: newSeries }];
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSeries((prev) => {
        const updatedSeries = getRandomData(prev, isTapped);

        const lastCandleTime = updatedSeries[0].data.at(-1).x.getTime();
        setChartRange({
          min: lastCandleTime - CANDLE_INTERVAL * CANDLES_VISIBLE,
          max: lastCandleTime,
        });

        return updatedSeries;
      });
    }, CANDLE_INTERVAL);
    return () => clearInterval(timer);
  }, [isTapped]);

  return (
    <div className="flex-1" onClick={() => setIsTapped(true)}>
      <ReactApexChart
        // options={options}
        options={{ ...options, xaxis: { ...options.xaxis, ...chartRange } }}
        series={series}
        type="candlestick"
        height={"100%"}
        width={"100%"}
      />
    </div>
  );
}

export default CandleChart;
