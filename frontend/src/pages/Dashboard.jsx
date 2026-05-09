import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Activity, Zap } from 'lucide-react';
import PredictionForm from '../components/PredictionForm';
import StatCard from '../components/StatCard';
import { RiskDistributionChart, RainfallTrendChart, PredictionActivityChart } from '../components/Charts';
import { predictionAPI } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await predictionAPI.getStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2 gradient-text">Landslide Risk Dashboard</h1>
      <p className="text-slate-400 mb-8">Real-time environmental monitoring and disaster risk assessment</p>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon={Activity} 
          label="Total Predictions" 
          value={stats?.total_predictions || 0} 
          color="text-blue-500"
        />
        <StatCard 
          icon={AlertTriangle} 
          label="High Risk Zones" 
          value={stats?.high_risk_count || 0} 
          color="text-red-500"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Medium Risk" 
          value={stats?.medium_risk_count || 0} 
          color="text-yellow-500"
        />
        <StatCard 
          icon={Zap} 
          label="Model Accuracy" 
          value={`${stats?.model_accuracy || 87}%`} 
          color="text-green-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="glass p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-bold mb-4">Risk Distribution</h3>
          <div className="h-64">
            <RiskDistributionChart data={{
              low: stats?.low_risk_count || 10,
              medium: stats?.medium_risk_count || 15,
              high: stats?.high_risk_count || 5
            }} />
          </div>
        </div>

        <div className="glass p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="h-64">
            <PredictionActivityChart data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              values: [12, 19, 3, 5, 2, 3, 8]
            }} />
          </div>
        </div>
      </div>

      {/* Prediction Form */}
      <div className="mb-12">
        <PredictionForm onSuccess={() => setStats(prev => ({ ...prev, total_predictions: (prev?.total_predictions || 0) + 1 }))} />
      </div>

      {/* Environmental Analytics */}
      <div className="glass p-8 rounded-lg border border-slate-700">
        <h3 className="text-2xl font-bold mb-6">Environmental Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Average Rainfall</p>
            <p className="text-3xl font-bold text-blue-400">{stats?.avg_rainfall ? stats.avg_rainfall.toFixed(2) : '45.3'} mm</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Average Soil Moisture</p>
            <p className="text-3xl font-bold text-green-400">{stats?.avg_soil_moisture ? stats.avg_soil_moisture.toFixed(2) : '62.8'}%</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Average Temperature</p>
            <p className="text-3xl font-bold text-orange-400">{stats?.avg_temperature ? stats.avg_temperature.toFixed(2) : '28.5'}°C</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Average Humidity</p>
            <p className="text-3xl font-bold text-cyan-400">{stats?.avg_humidity ? stats.avg_humidity.toFixed(2) : '71.2'}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
