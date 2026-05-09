import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const RiskDistributionChart = ({ data }) => {
  const chartData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [data.low || 0, data.medium || 0, data.high || 0],
        backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
        borderColor: ['#16a34a', '#ca8a04', '#dc2626'],
        borderWidth: 2,
      }
    ]
  };

  return <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />;
};

const RainfallTrendChart = ({ data }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: 'Rainfall (mm)',
        data: data.values || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  return <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />;
};

const PredictionActivityChart = ({ data }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: 'Predictions',
        data: data.values || [],
        backgroundColor: '#ef4444',
        borderColor: '#dc2626',
        borderWidth: 1,
      }
    ]
  };

  return <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />;
};

export { RiskDistributionChart, RainfallTrendChart, PredictionActivityChart };
