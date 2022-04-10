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
  Filler,
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
  Legend,
  Filler
);

type Props = {
  store: Record<string, any>;
  mode: "newCases" | "newDeaths";
};

const chartColorOptions = {
  newCases: {
    label: "New Cases",
    borderColor: "rgb(248, 113, 113)",
    backgroundColor: "rgba(248, 113, 113, 0.2)",
    fill: true,
  },
  newDeaths: {
    label: "New Deaths",
    borderColor: "rgb(108, 117, 125)",
    backgroundColor: "rgba(108, 117, 125, 0.2)",
    fill: true,
  },
};

const dateFormatter = (dateStr: string) => {
  let sub = new Date(dateStr).toDateString().split(" ").slice(1);
  const formattedDate = sub[1] + " " + sub[0] + " " + sub[2];
  return formattedDate;
};

export default function ChartContainer({ mode, store }: Props) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        display: false,
      },
    },
  };

  const chartData = Object.keys(store[mode]).map((item) => {
    return {
      x: dateFormatter(item),
      y: store[mode][item],
    };
  });

  const data = {
    datasets: [
      {
        label: chartColorOptions[mode]["label"],
        data: chartData,
        borderColor: chartColorOptions[mode]["borderColor"],
        backgroundColor: chartColorOptions[mode]["backgroundColor"],
        fill: true,
      },
    ],
  };
  // show new cases worldwide
  // display a filter for start and end dates, and to change the data being displayed.
  // three statuses will be shown: confirmed cases, active cases and deaths

  return (
    <div className="col-sm-8 col-12 mb-1">
      <Chart type="line" options={options} data={data} />
    </div>
  );
}
