import { AlertTriangle, BarChart3, Database, Cloud } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold mb-12 gradient-text">About Landslide Prediction</h1>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">What is a Landslide?</h2>
        <p className="text-slate-300 text-lg leading-relaxed mb-4">
          A landslide is the movement of a mass of rock, debris, or earth down a slope. Landslides are caused by heavy rainfall, earthquakes, rapid snowmelt, changes in water level, stream erosion, changes in groundwater, volcanic activity, human modification of the land, and other factors.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          Landslides can be destructive, causing loss of life, property damage, and displacement of communities. Predicting and monitoring landslide risks is crucial for disaster management.
        </p>
      </section>

      <section className="mb-16 grid md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-lg border border-slate-700">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-2xl font-bold mb-4">Risk Factors</h3>
          <ul className="text-slate-300 space-y-2">
            <li>• Heavy rainfall and water saturation</li>
            <li>• Steep slopes and geology</li>
            <li>• Seismic activity</li>
            <li>• Vegetation loss</li>
            <li>• Water level changes</li>
            <li>• Soil composition and moisture</li>
          </ul>
        </div>

        <div className="glass p-8 rounded-lg border border-slate-700">
          <BarChart3 className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-2xl font-bold mb-4">Our ML Approach</h3>
          <ul className="text-slate-300 space-y-2">
            <li>• Random Forest Classification</li>
            <li>• 10 Environmental Features</li>
            <li>• Real-time Predictions</li>
            <li>• 87%+ Accuracy</li>
            <li>• AWS SageMaker Deployment</li>
            <li>• Continuous Learning</li>
          </ul>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Prediction Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Rainfall Amount', desc: 'Heavy rainfall increases soil saturation and destabilization risk' },
            { title: 'Soil Moisture', desc: 'Higher moisture content reduces soil strength and stability' },
            { title: 'Slope Angle', desc: 'Steeper slopes have higher gravitational stress on soil' },
            { title: 'Soil Type', desc: 'Different soil compositions have different failure characteristics' },
            { title: 'Temperature', desc: 'Temperature affects soil properties and weathering processes' },
            { title: 'Elevation', desc: 'Altitude influences precipitation and geological formations' },
            { title: 'Earthquake Activity', desc: 'Seismic events trigger immediate instability' },
            { title: 'Vegetation Density', desc: 'Plant roots provide soil reinforcement and stability' }
          ].map((item, i) => (
            <div key={i} className="glass p-6 rounded-lg border border-slate-700">
              <h4 className="text-lg font-semibold text-red-400 mb-2">{item.title}</h4>
              <p className="text-slate-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass p-8 rounded-lg border border-slate-700">
        <Cloud className="w-12 h-12 text-blue-500 mb-4" />
        <h2 className="text-3xl font-bold mb-4">Cloud Architecture</h2>
        <p className="text-slate-300 mb-4">
          Our system uses AWS cloud services to provide reliable, scalable, and secure landslide prediction:
        </p>
        <ul className="text-slate-300 space-y-2 ml-6">
          <li>• <strong>AWS SageMaker:</strong> Machine learning model training and deployment</li>
          <li>• <strong>AWS Lambda:</strong> Serverless prediction request processing</li>
          <li>• <strong>AWS API Gateway:</strong> RESTful API endpoints</li>
          <li>• <strong>Amazon S3:</strong> Data and model storage</li>
          <li>• <strong>CloudWatch:</strong> Monitoring and logging</li>
        </ul>
      </section>
    </div>
  );
};

export default About;
