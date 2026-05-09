import { Link } from 'react-router-dom';
import { AlertTriangle, Cloud, Map, TrendingDown } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          <div className="mb-8">
            <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-4 animate-bounce" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">AI-Powered Landslide</span>
            <br />
            <span>Risk Prediction System</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Leveraging advanced machine learning and cloud computing to predict landslide risks in real-time. Protect communities through intelligent disaster risk assessment.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/dashboard" className="bg-gradient-accent text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition">
              Start Prediction
            </Link>
            <Link to="/about" className="border-2 border-slate-500 text-white px-8 py-3 rounded-lg font-semibold hover:border-red-500 transition">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-lg border border-slate-700 hover:border-red-500 transition">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-Time Risk Assessment</h3>
              <p className="text-slate-300">Instant landslide risk prediction based on environmental and geological factors.</p>
            </div>
            <div className="glass p-8 rounded-lg border border-slate-700 hover:border-red-500 transition">
              <Cloud className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Cloud-Based ML Models</h3>
              <p className="text-slate-300">Deployed on AWS SageMaker with high availability and scalability.</p>
            </div>
            <div className="glass p-8 rounded-lg border border-slate-700 hover:border-red-500 transition">
              <Map className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Disaster Monitoring</h3>
              <p className="text-slate-300">Comprehensive environmental monitoring and historical data analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React + Vite', cat: 'Frontend' },
              { name: 'FastAPI', cat: 'Backend' },
              { name: 'Python ML', cat: 'Machine Learning' },
              { name: 'AWS Cloud', cat: 'Cloud' },
              { name: 'Tailwind CSS', cat: 'Styling' },
              { name: 'MongoDB', cat: 'Database' },
              { name: 'SageMaker', cat: 'ML Ops' },
              { name: 'Lambda', cat: 'Serverless' }
            ].map((tech, i) => (
              <div key={i} className="glass p-6 rounded-lg text-center border border-slate-700">
                <p className="font-semibold text-white">{tech.name}</p>
                <p className="text-sm text-slate-400 mt-2">{tech.cat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-accent/10 border-t border-slate-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Predict Landslide Risks?</h2>
          <p className="text-slate-300 mb-8">Join us in making disaster risk prediction accessible and accurate.</p>
          <Link to="/signup" className="bg-gradient-accent text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
