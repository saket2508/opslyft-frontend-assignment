import { Chart as ChartJS, registerables as Registerables } from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(...Registerables);

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

export default function ChartContainer(props: {
  store: Record<string, any>;
  mode: "newCases" | "newDeaths";
}) {
  const { store, mode } = props;
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

  return (
    <div className="col-sm-8 col-12 mb-1">
      <Chart type="line" options={options} data={data} />
    </div>
  );
}
