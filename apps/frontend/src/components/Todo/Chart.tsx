import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderWidth: 0,
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    tooltip: {
      mode: "index" as const,
      intersect: true,
      position: "nearest" as const,
    },
  },
  maintainAspectRatio: false,
};

const HorizontalBarChart = ({ dataForChart }: any) => {
  const renderStyle = (label: number) => {
    const height = 50 + label * 40;
    return {
      width: "100%",
      height: `${height}px`,
    };
  };

  const BarChart = useMemo(() => {
    return <Bar options={options} data={dataForChart} />;
  }, [dataForChart]);
  return (
    <>
      <div style={renderStyle(dataForChart?.labels?.length)}>{BarChart}</div>
    </>
  );
};

export default HorizontalBarChart;
