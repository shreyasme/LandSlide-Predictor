import { Menu, LogOut, Settings, Home } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="glass border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">LP</span>
          </div>
          <span className="text-xl font-bold gradient-text">Landslide Predictor</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-slate-300 hover:text-white transition">Home</Link>
          <Link to="/about" className="text-slate-300 hover:text-white transition">About</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-slate-300 hover:text-white transition">Dashboard</Link>
              <Link to="/history" className="text-slate-300 hover:text-white transition">History</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-slate-300 hover:text-white transition">Admin</Link>
              )}
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white transition">Login</Link>
              <Link to="/signup" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <Menu className="w-6 h-6" />
        </button>

        {isOpen && (
          <div className="absolute top-16 right-4 glass rounded-lg p-4 w-48 md:hidden">
            <Link to="/" className="block py-2 text-slate-300 hover:text-white">Home</Link>
            <Link to="/about" className="block py-2 text-slate-300 hover:text-white">About</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block py-2 text-slate-300 hover:text-white">Dashboard</Link>
                <Link to="/history" className="block py-2 text-slate-300 hover:text-white">History</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block py-2 text-slate-300 hover:text-white">Admin</Link>
                )}
                <button onClick={handleLogout} className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition mt-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-slate-300 hover:text-white">Login</Link>
                <Link to="/signup" className="block w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition mt-2 text-center">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
