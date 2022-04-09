import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  store: Record<string, any>;
};

const dateFormatter = (dateStr: string) => {
  let sub = new Date(dateStr).toDateString().split(" ").slice(1);
  const formattedDate = sub[1] + " " + sub[0] + " " + sub[2];
  return formattedDate;
};

export default function ChartContainer({ store }: Props) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        display: false,
      },
    },
  };

  const chartData = Object.keys(store["newCases"]).map((key) => {
    return {
      x: dateFormatter(key),
      y: store["newCases"][key],
    };
  });

  const data = {
    datasets: [
      {
        label: "New Cases",
        data: chartData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  // show new cases worldwide
  // display a filter for start and end dates, and to change the data being displayed.
  // three statuses will be shown: confirmed cases, active cases and deaths

  return (
    <div className="col-sm-8 col-12 mb-3">
      <Chart type="line" options={options} data={data} />
    </div>
  );
}
