import { useState, useEffect } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { predictionAPI } from '../utils/api';

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await predictionAPI.getHistory();
        setPredictions(response.data.predictions || []);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getRiskColor = (risk) => {
    if (risk === 'HIGH') return 'text-red-500';
    if (risk === 'MEDIUM') return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleExport = (prediction) => {
    const csv = `Prediction Report\nDate: ${prediction.created_at}\nRisk Level: ${prediction.risk_level}\nProbability: ${(prediction.probability * 100).toFixed(2)}%\nRainfall: ${prediction.rainfall} mm\nSoil Moisture: ${prediction.soil_moisture}%\nTemperature: ${prediction.temperature}°C`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prediction-${prediction.id}.csv`;
    a.click();
  };

  if (loading) {
    return <div className="text-center py-20">Loading prediction history...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2 gradient-text">Prediction History</h1>
      <p className="text-slate-400 mb-8">View and manage your past predictions</p>

      {predictions.length === 0 ? (
        <div className="glass p-12 rounded-lg border border-slate-700 text-center">
          <p className="text-slate-300 text-lg">No predictions yet. Start by making a prediction on the dashboard.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {predictions.map((pred, idx) => (
            <div key={idx} className="glass p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-2xl font-bold ${getRiskColor(pred.risk_level)}`}>
                      {pred.risk_level}
                    </span>
                    <span className="text-slate-400 text-sm">
                      {new Date(pred.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300">
                    Probability: <span className="font-semibold">{(pred.probability * 100).toFixed(2)}%</span>
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3 text-sm text-slate-400">
                    <div>Rainfall: {pred.rainfall} mm</div>
                    <div>Humidity: {pred.humidity}%</div>
                    <div>Soil: {pred.soil_moisture}%</div>
                    <div>Temp: {pred.temperature}°C</div>
                    <div>Slope: {pred.slope_angle}°</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleExport(pred)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
