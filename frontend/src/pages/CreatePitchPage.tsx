import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, X, AlertCircle } from 'lucide-react';
import { createPitch } from '../services/api';
import AuthContext from '../context/AuthContext';

interface CreatePitchFormInputs {
  title: string;
  description: string;
  category: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
}

const CreatePitchPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<CreatePitchFormInputs>();

  const categories = [
    'Technology',
    'Health',
    'Finance',
    'Education',
    'Environment',
    'Entertainment',
    'Food',
    'Real Estate',
    'Other'
  ];

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreatePitchFormInputs) => {
    try {
      setLoading(true);
      setError(null);
      
      const pitchData = {
        ...data,
        tags,
      };
      
      const createdPitch = await createPitch(pitchData);
      navigate(`/pitch/${createdPitch._id}`);
    } catch (error: any) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to create pitch. Please try again.'
      );
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold mb-6">Create a New Pitch</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
              <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                placeholder="A catchy title for your pitch"
                {...register('title', { 
                  required: 'Title is required',
                  minLength: {
                    value: 5,
                    message: 'Title must be at least 5 characters'
                  },
                  maxLength: {
                    value: 100,
                    message: 'Title must be less than 100 characters'
                  }
                })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                rows={6}
                className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your idea in detail. What problem does it solve? What makes it unique?"
                {...register('description', { 
                  required: 'Description is required',
                  minLength: {
                    value: 50,
                    message: 'Description must be at least 50 characters'
                  }
                })}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                {...register('category', { required: 'Please select a category' })}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (Optional)
              </label>
              <div className="flex items-center">
                <input
                  id="tags"
                  type="text"
                  className="input-field flex-grow"
                  placeholder="Add tags and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div 
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="ml-1.5 text-blue-700 hover:text-blue-900 focus:outline-none"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Add up to 5 tags that best describe your pitch
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email *
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  className={`input-field ${errors.contactEmail ? 'border-red-500' : ''}`}
                  placeholder="email@example.com"
                  defaultValue={user?.email || ''}
                  {...register('contactEmail', { 
                    required: 'Contact email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                )}
              </div>

              <div className="mt-4">
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  className="input-field"
                  placeholder="+1 (123) 456-7890"
                  {...register('contactPhone')}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website (Optional)
                </label>
                <input
                  id="website"
                  type="url"
                  className="input-field"
                  placeholder="https://example.com"
                  {...register('website')}
                />
              </div>
            </div>

            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full btn btn-primary py-3 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  'Create Pitch'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePitchPage;