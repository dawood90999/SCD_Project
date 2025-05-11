import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Facebook, Mail, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 pt-12 pb-6 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">PitchHub</h3>
            <p className="text-gray-400">
              The premier platform for entrepreneurs to share their ideas and connect with potential investors and partners.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pitches" className="text-gray-400 hover:text-white transition-colors">
                  Browse Pitches
                </Link>
              </li>
              <li>
                <Link to="/create-pitch" className="text-gray-400 hover:text-white transition-colors">
                  Create Pitch
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/pitches?category=Technology" className="text-gray-400 hover:text-white transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/pitches?category=Health" className="text-gray-400 hover:text-white transition-colors">
                  Health
                </Link>
              </li>
              <li>
                <Link to="/pitches?category=Finance" className="text-gray-400 hover:text-white transition-colors">
                  Finance
                </Link>
              </li>
              <li>
                <Link to="/pitches?category=Education" className="text-gray-400 hover:text-white transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/pitches?category=Environment" className="text-gray-400 hover:text-white transition-colors">
                  Environment
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={18} className="text-gray-400" />
              <span className="text-gray-400">contact@pitchhub.com</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} PitchHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;