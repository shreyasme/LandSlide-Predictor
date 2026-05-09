import { useState } from 'react';
import { Upload, RotateCcw, Eye } from 'lucide-react';
import StatCard from '../components/StatCard';
import { adminAPI } from '../utils/api';

const Admin = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage('');
    try {
      await adminAPI.uploadDataset(file);
      setMessage('Dataset uploaded successfully!');
      setFile(null);
    } catch (err) {
      setMessage('Upload failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    setMessage('');
    try {
      await adminAPI.retrainModel();
      setMessage('Model retraining initiated successfully!');
    } catch (err) {
      setMessage('Retraining failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setRetraining(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2 gradient-text">Admin Panel</h1>
      <p className="text-slate-400 mb-8">System administration and model management</p>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon={Eye} 
          label="Total Predictions" 
          value="847" 
          color="text-blue-500"
        />
        <StatCard 
          icon={Eye} 
          label="Active Users" 
          value="234" 
          color="text-green-500"
        />
        <StatCard 
          icon={Eye} 
          label="System Uptime" 
          value="99.9%" 
          color="text-purple-500"
        />
        <StatCard 
          icon={Eye} 
          label="API Calls" 
          value="12.4K" 
          color="text-yellow-500"
        />
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg mb-8 ${message.includes('failed') ? 'bg-red-500/20 border border-red-500 text-red-300' : 'bg-green-500/20 border border-green-500 text-green-300'}`}>
          {message}
        </div>
      )}

      {/* Model Management */}
      <div className="glass p-8 rounded-lg border border-slate-700 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <RotateCcw className="w-6 h-6" />
          Model Management
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Current Model Version</h3>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-300">Version: 2.1.0</p>
              <p className="text-slate-300">Accuracy: 87.5%</p>
              <p className="text-slate-300">Last Updated: 2 hours ago</p>
            </div>
          </div>
          <button
            onClick={handleRetrain}
            disabled={retraining}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {retraining ? 'Retraining...' : 'Retrain Model'}
          </button>
        </div>
      </div>

      {/* Dataset Upload */}
      <div className="glass p-8 rounded-lg border border-slate-700 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Upload Dataset
        </h2>
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-600 p-8 rounded-lg text-center">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".csv,.xlsx"
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-300">Click to upload or drag and drop</p>
              <p className="text-slate-400 text-sm">CSV or XLSX files up to 100MB</p>
              {file && (
                <p className="text-green-400 mt-2">Selected: {file.name}</p>
              )}
            </label>
          </div>
          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Dataset'}
          </button>
        </form>
      </div>

      {/* System Monitoring */}
      <div className="glass p-8 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-bold mb-6">System Monitoring</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">API Response Time</p>
            <p className="text-2xl font-bold text-green-400">145 ms</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Database Query Time</p>
            <p className="text-2xl font-bold text-green-400">89 ms</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">AWS CloudWatch Logs</p>
            <p className="text-sm text-slate-300 mt-2">View logs in AWS Console</p>
            <button className="mt-3 text-blue-400 hover:text-blue-300 text-sm">
              Open CloudWatch →
            </button>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">SageMaker Endpoint</p>
            <p className="text-sm text-slate-300 mt-2">Status: Active</p>
            <button className="mt-3 text-blue-400 hover:text-blue-300 text-sm">
              View Endpoint →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
