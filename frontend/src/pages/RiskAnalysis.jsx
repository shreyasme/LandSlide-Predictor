import { useState, useEffect } from 'react';
import { AlertTriangle, Droplets, Thermometer, Wind } from 'lucide-react';

const RiskAnalysis = () => {
  const [selectedRegion, setSelectedRegion] = useState('region1');

  const regions = {
    region1: {
      name: 'Mountain Region A',
      risk: 'HIGH',
      probability: 78,
      rainfall: 125,
      soil_moisture: 85,
      temp: 15,
      humidity: 88,
      slope: 45,
      recommendations: 'Immediate evacuation recommended. Heavy rainfall expected.'
    },
    region2: {
      name: 'Valley Region B',
      risk: 'MEDIUM',
      probability: 52,
      rainfall: 65,
      soil_moisture: 58,
      temp: 22,
      humidity: 65,
      slope: 25,
      recommendations: 'Heightened alert. Monitor weather conditions closely.'
    },
    region3: {
      name: 'Plateau Region C',
      risk: 'LOW',
      probability: 18,
      rainfall: 25,
      soil_moisture: 35,
      temp: 28,
      humidity: 45,
      slope: 8,
      recommendations: 'Normal conditions. Continue regular monitoring.'
    }
  };

  const region = regions[selectedRegion];

  const getRiskColor = (risk) => {
    if (risk === 'HIGH') return 'text-red-500 bg-red-500/20';
    if (risk === 'MEDIUM') return 'text-yellow-500 bg-yellow-500/20';
    return 'text-green-500 bg-green-500/20';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2 gradient-text">Live Risk Analysis</h1>
      <p className="text-slate-400 mb-8">Region-wise landslide risk assessment and monitoring</p>

      {/* Region Selection */}
      <div className="glass p-8 rounded-lg border border-slate-700 mb-8">
        <h2 className="text-2xl font-bold mb-6">Select Region</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(regions).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setSelectedRegion(key)}
              className={`p-4 rounded-lg border-2 transition ${
                selectedRegion === key 
                  ? 'border-red-500 bg-red-500/10' 
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
              }`}
            >
              <p className="font-semibold">{value.name}</p>
              <p className={`text-sm mt-2 ${getRiskColor(value.risk).split(' ')[0]}`}>
                Risk: {value.risk}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Risk Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className={`glass p-8 rounded-lg border-2 ${getRiskColor(region.risk).split(' ')[1]}`}>
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8" />
            <h3 className="text-3xl font-bold">{region.name}</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Risk Level</span>
              <span className={`text-2xl font-bold ${getRiskColor(region.risk).split(' ')[0]}`}>
                {region.risk}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Risk Probability</span>
              <span className="text-2xl font-bold text-red-400">{region.probability}%</span>
            </div>
            <div className="w-full bg-slate-800/50 rounded-full h-3 mt-4">
              <div 
                className="bg-gradient-accent h-3 rounded-full" 
                style={{ width: `${region.probability}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-lg border border-slate-700">
          <h3 className="text-2xl font-bold mb-6">Safety Recommendation</h3>
          <div className="bg-slate-800/50 p-6 rounded-lg border-l-4 border-blue-500 mb-6">
            <p className="text-slate-200 font-semibold">{region.recommendations}</p>
          </div>
          <div className="space-y-3">
            <p className="text-slate-400 text-sm">Last Updated: 2 minutes ago</p>
            <p className="text-slate-400 text-sm">Data Source: AWS SageMaker Prediction</p>
            <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition mt-4">
              Send Alert
            </button>
          </div>
        </div>
      </div>

      {/* Environmental Conditions */}
      <div className="glass p-8 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-bold mb-6">Current Environmental Conditions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400 text-sm">Rainfall</span>
            </div>
            <p className="text-3xl font-bold text-blue-400">{region.rainfall} mm</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-5 h-5 text-green-400" />
              <span className="text-slate-400 text-sm">Soil Moisture</span>
            </div>
            <p className="text-3xl font-bold text-green-400">{region.soil_moisture}%</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-5 h-5 text-orange-400" />
              <span className="text-slate-400 text-sm">Temperature</span>
            </div>
            <p className="text-3xl font-bold text-orange-400">{region.temp}°C</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-5 h-5 text-cyan-400" />
              <span className="text-slate-400 text-sm">Humidity</span>
            </div>
            <p className="text-3xl font-bold text-cyan-400">{region.humidity}%</p>
          </div>
        </div>
      </div>

      {/* Risk Heatmap Section */}
      <div className="glass p-8 rounded-lg border border-slate-700 mt-8">
        <h2 className="text-2xl font-bold mb-6">Risk Heatmap</h2>
        <div className="bg-slate-900 p-6 rounded-lg h-64 relative overflow-hidden">
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(239, 68, 68, 0.3), transparent 40%), radial-gradient(circle at 70% 60%, rgba(234, 179, 8, 0.2), transparent 40%)',
            backgroundSize: 'cover'
          }} />
          <p className="absolute bottom-4 right-4 text-slate-400 text-sm">
            Red: High Risk | Yellow: Medium Risk | Green: Low Risk
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
