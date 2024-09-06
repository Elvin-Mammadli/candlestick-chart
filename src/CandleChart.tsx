import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getRandomChartData, getRndInteger, percentage } from "./functions";
import { CANDLE_INTERVAL, CANDLES_VISIBLE } from "./constants";
import { ChartData } from "./types";

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

function CandleChart() {
  const [series, setSeries] = useState<ChartData[]>(getRandomChartData(20));
  const [isTapped, setIsTapped] = useState(false);
  const [chartRange, setChartRange] = useState({
    min: series[0].data.at(-1)!.x.getTime() - CANDLE_INTERVAL * CANDLES_VISIBLE,
    max: series[0].data.at(-1)!.x.getTime(),
  });

  const getRandomData = (prevSeries: ChartData[], tapped: boolean) => {
    const newSeries = [...prevSeries[0].data];
    const lastItem = newSeries.at(-1);
    const close = lastItem!.y[3];
    const newOpen = close || 1;
    const diff = Math.ceil(percentage(newOpen, 30));
    const newHigh = getRndInteger(newOpen + 1, newOpen + diff);
    const newLow = getRndInteger(newOpen - diff, newOpen);

    const newClose = tapped
      ? getRndInteger(newOpen, newHigh)
      : getRndInteger(newOpen, newLow);
    const newRandomCandleData = {
      x: new Date(lastItem!.x.getTime() + CANDLE_INTERVAL),
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

        const lastCandleTime = updatedSeries[0].data.at(-1)!.x.getTime();
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
