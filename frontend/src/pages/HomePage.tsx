import React from 'react';
import { Link } from 'react-router-dom';
import { LightbulbIcon, TrendingUp, Users, Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const categories = [
    { name: 'Technology', icon: <LightbulbIcon />, color: 'bg-indigo-100 text-indigo-700' },
    { name: 'Health', icon: <Users />, color: 'bg-red-100 text-red-700' },
    { name: 'Finance', icon: <TrendingUp />, color: 'bg-green-100 text-green-700' },
    { name: 'Education', icon: <Users />, color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Environment', icon: <LightbulbIcon />, color: 'bg-teal-100 text-teal-700' },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl mb-16">
        <div className="container-custom">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Bring Your Ideas to Life with PitchHub</h1>
            <p className="text-xl mb-8 text-blue-100">
              Connect with investors, partners, and collaborators who can help turn your vision into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/pitches" 
                  className="btn bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold text-lg inline-block"
                >
                  Browse Pitches
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/create-pitch" 
                  className="btn bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold text-lg inline-block"
                >
                  Share Your Idea
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How PitchHub Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes it simple to share your ideas and connect with the resources you need.
            </p>
          </div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants} className="card p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LightbulbIcon size={30} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Share Your Idea</h3>
              <p className="text-gray-600">
                Create a detailed pitch with all the information potential partners need to understand your vision.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="card p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={30} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect & Collaborate</h3>
              <p className="text-gray-600">
                Receive feedback, answer questions, and connect with interested partners and investors.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="card p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={30} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Grow Your Business</h3>
              <p className="text-gray-600">
                Turn your idea into reality with the resources, funding, and support you've gathered.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore ideas across different industries and find opportunities that interest you.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className={`card p-4 flex flex-col items-center justify-center text-center cursor-pointer ${category.color}`}
              >
                <Link to={`/pitches?category=${category.name}`} className="flex flex-col items-center">
                  <div className="mb-3">
                    {category.icon}
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div 
            className="bg-blue-600 rounded-2xl p-10 text-white text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Share Your Vision?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who've found success by sharing their ideas on PitchHub.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/register" 
                className="btn bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg inline-flex items-center"
              >
                Get Started Now
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;