import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { predictionAPI } from '../utils/api';
import { getRiskColor, getRiskRecommendation, getRiskIcon } from '../utils/helpers';

const PredictionForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    rainfall: '',
    humidity: '',
    soil_moisture: '',
    slope_angle: '',
    soil_type: 'clay',
    temperature: '',
    earthquake_intensity: '',
    elevation: '',
    vegetation_density: '',
    water_level: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await predictionAPI.predict(formData);
      setResult(response.data);
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-lg border border-slate-700">
      <h2 className="text-2xl font-bold mb-6">Landslide Prediction Form</h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="number"
            name="rainfall"
            placeholder="Rainfall (mm)"
            value={formData.rainfall}
            onChange={handleChange}
            required
            step="0.1"
            className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
          <input
            type="number"
            name="humidity"
            placeholder="Humidity (%)"
            value={formData.humidity}
            onChange={handleChange}
            required
            max="100"
            step="0.1"
            className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
          <input
            type="number"
            name="soil_moisture"
            placeholder="Soil Moisture (%)"
            value={formData.soil_moisture}
            onChange={handleChange}
            required
            max="100"
            step="0.1"
            className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
          <input
            type="number"
            name="slope_angle"
            placeholder="Slope Angle (degrees)"
            value={formData.slope_angle}
            onChange={handleChange}
            required
            step="0.1"
            className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
          <select
            name="soil_type"
            value={formData.soil_type}
            onChange={handleChange}
            className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
          >
            <option value="clay">Clay</option>
            <option value="sand">Sand</option>
            <option value="silt">Silt</option>
            <option value="rock">Rock</option>
          </select>
          <input
            type="number"
            name="temperature"
            placeholder="Temperature (°C)"
            value={formData.temperature}
            onChange={handleChange}
            required
            step="0.1"
            className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
          <input
            type="number"
            name="earthquake_intensity"
            placeholder="Earthquake Intensity (Richter)"
            value={formData.earthquake_intensity}
            onChange={handleChange}
            required
            step="0.1"
            className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
          <input
            type="number"
            name="elevation"
            placeholder="Elevation (m)"
            value={formData.elevation}
            onChange={handleChange}
            required
            step="0.1"
            className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
          <input
            type="number"
            name="vegetation_density"
            placeholder="Vegetation Density (%)"
            value={formData.vegetation_density}
            onChange={handleChange}
            required
            max="100"
            step="0.1"
            className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
          <input
            type="number"
            name="water_level"
            placeholder="Water Level (m)"
            value={formData.water_level}
            onChange={handleChange}
            required
            step="0.1"
            className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-accent text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Get Prediction'}
        </button>
      </form>

      {result && (
        <div className={`mt-8 glass-accent p-6 rounded-lg border-2 ${getRiskColor(result.risk_level).replace('text-', 'border-')}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{getRiskIcon(result.risk_level)}</span>
            <h3 className="text-2xl font-bold">Landslide Risk: <span className={getRiskColor(result.risk_level)}>{result.risk_level}</span></h3>
          </div>
          <p className="text-xl font-semibold mb-2">Probability: <span className="gradient-text">{(result.probability * 100).toFixed(2)}%</span></p>
          <div className="bg-slate-800/50 p-4 rounded-lg mt-4 border-l-4 border-blue-500">
            <p className="text-slate-300 font-semibold mb-2">Safety Recommendation:</p>
            <p className="text-slate-200">{getRiskRecommendation(result.risk_level)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
