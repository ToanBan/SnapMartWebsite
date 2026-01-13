'use client'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const RevenueChart = ({ data }:{data:any}) => {
  const labels = data.map((item:any) => `Tháng ${item.month}`);
  const revenues = data.map((item:any) => item.revenue);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: revenues,
        fill: false,
        borderColor: "#4f46e5",
        backgroundColor: "#4f46e5",
        tension: 0.4, // cong mềm
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx:any) =>
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(ctx.raw),
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value:any) =>
            new Intl.NumberFormat("vi-VN").format(value),
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default RevenueChart;
