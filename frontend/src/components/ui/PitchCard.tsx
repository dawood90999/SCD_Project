import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, Eye, MessageSquare, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { PitchData } from '../../services/api';

interface PitchCardProps {
  pitch: PitchData;
}

const PitchCard: React.FC<PitchCardProps> = ({ pitch }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Truncate description to 150 characters
  const truncateDescription = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <motion.div 
      className="card hover:shadow-lg transition-shadow"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold mb-1">
              <Link to={`/pitch/${pitch._id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                {pitch.title}
              </Link>
            </h3>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(pitch.createdAt)}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Eye size={14} className="mr-1" />
                {pitch.views}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <MessageSquare size={14} className="mr-1" />
                {pitch.comments.length}
              </span>
            </div>
          </div>
          <div className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(pitch.status || 'open')}`}>
            {pitch.status || 'open'}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600">{truncateDescription(pitch.description)}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium">
            {pitch.category}
          </span>
          {pitch.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md flex items-center">
              <Tag size={12} className="mr-1" />
              {tag}
            </span>
          ))}
          {pitch.tags.length > 3 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
              +{pitch.tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="border-t pt-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              {pitch.user.profileImage ? (
                <img src={pitch.user.profileImage} alt={pitch.user.name} className="w-8 h-8 rounded-full" />
              ) : (
                <span className="text-sm font-medium">{pitch.user.name.charAt(0)}</span>
              )}
            </div>
            <span className="text-sm font-medium">{pitch.user.name}</span>
          </div>
          <Link 
            to={`/pitch/${pitch._id}`} 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            View Details 
            <ExternalLink size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PitchCard;