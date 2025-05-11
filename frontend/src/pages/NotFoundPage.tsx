import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16 flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-8">
          <div className="bg-red-100 rounded-full p-8">
            <Search size={80} className="text-red-500" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/"
            className="btn btn-primary flex items-center justify-center"
          >
            <Home size={18} className="mr-2" />
            Go Home
          </Link>
          <Link 
            to="/pitches"
            className="btn btn-secondary"
          >
            Browse Pitches
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;