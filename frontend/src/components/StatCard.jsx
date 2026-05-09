import { AlertTriangle, Shield, Activity, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color = 'text-blue-500' }) => (
  <div className="glass p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <Icon className={`w-10 h-10 ${color}`} />
    </div>
  </div>
);

export default StatCard;
