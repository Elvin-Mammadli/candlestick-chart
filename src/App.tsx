import CandleChart from "./CandleChart";
import KlineCharts from "./KlineCandleChart";

function App() {
  return (
    <div className="flex border border-red-600 h-screen">
      <CandleChart />
      {/* <KlineCharts /> */}
    </div>
  );
}

export default App;
