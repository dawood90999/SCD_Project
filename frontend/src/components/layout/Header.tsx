import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, PlusCircle, Search, Home, Grid, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/pitches?keyword=${searchTerm}`);
      setSearchTerm('');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-blue-600 shadow-md' : 'bg-blue-600 bg-opacity-95'
      }`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="bg-white text-blue-600 p-1 rounded-md"
            >
              <Grid size={24} />
            </motion.div>
            PitchHub
          </Link>

          {/* Search on medium and larger screens */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex items-center bg-white bg-opacity-20 rounded-lg px-3 py-2 flex-1 max-w-md mx-8"
          >
            <input
              type="text"
              placeholder="Search pitches..."
              className="bg-transparent border-none focus:outline-none text-white placeholder-gray-200 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="ml-2 text-white">
              <Search size={20} />
            </button>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/pitches" className="text-white hover:text-blue-200 transition-colors flex items-center gap-1">
              <Grid size={18} />
              <span>Browse</span>
            </Link>
            
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/create-pitch" 
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                  >
                    <PlusCircle size={18} className="mr-1" />
                    New Pitch
                  </Link>
                </motion.div>
                <div className="relative group">
                  <button className="flex items-center text-white hover:text-blue-200 transition-colors">
                    <User size={20} className="mr-1" />
                    {user.name.split(' ')[0]}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-600 flex items-center"
                    >
                      <LogOut size={16} className="mr-1" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/register" 
                    className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden focus:outline-none text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile search */}
        <form 
          onSubmit={handleSearch}
          className="mt-4 md:hidden flex items-center bg-white bg-opacity-20 rounded-lg px-3 py-2"
        >
          <input
            type="text"
            placeholder="Search pitches..."
            className="bg-transparent border-none focus:outline-none text-white placeholder-gray-200 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="ml-2 text-white">
            <Search size={20} />
          </button>
        </form>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 md:hidden bg-blue-700 rounded-lg p-4 space-y-3 overflow-hidden"
            >
              <Link 
                to="/"
                className="block hover:text-blue-200 transition-colors py-2 text-white flex items-center gap-2"
              >
                <Home size={18} />
                Home
              </Link>
              <Link 
                to="/pitches" 
                className="block hover:text-blue-200 transition-colors py-2 text-white flex items-center gap-2"
              >
                <Grid size={18} />
                Browse Pitches
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/create-pitch" 
                    className="block bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                  >
                    <PlusCircle size={18} className="mr-1" />
                    New Pitch
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block hover:text-blue-200 transition-colors py-2 text-white flex items-center gap-2"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left hover:text-blue-200 transition-colors py-2 text-red-300 flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="block hover:text-blue-200 transition-colors py-2 text-white"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;