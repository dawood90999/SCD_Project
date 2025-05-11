import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, X, AlertCircle } from 'lucide-react';
import { fetchPitchById, updatePitch, PitchData } from '../services/api';
import AuthContext from '../context/AuthContext';

interface EditPitchFormInputs {
  title: string;
  description: string;
  category: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  status: string;
}

const EditPitchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [pitch, setPitch] = useState<PitchData | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue
  } = useForm<EditPitchFormInputs>();

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

  const statuses = ['open', 'in progress', 'closed'];

  useEffect(() => {
    const fetchPitchData = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        const data = await fetchPitchById(id);
        setPitch(data);
        
        // Check if user is the owner of the pitch
        if (user && data.user._id !== user._id) {
          setError('You are not authorized to edit this pitch.');
          return;
        }
        
        // Set form values
        setValue('title', data.title);
        setValue('description', data.description);
        setValue('category', data.category);
        setValue('contactEmail', data.contactEmail);
        setValue('contactPhone', data.contactPhone || '');
        setValue('website', data.website || '');
        setValue('status', data.status || 'open');
        
        setTags(data.tags || []);
      } catch (error) {
        setError('Failed to load pitch details. The pitch might have been removed or you may not have access.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPitchData();
  }, [id, user, setValue]);

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

  const onSubmit = async (data: EditPitchFormInputs) => {
    try {
      setSubmitting(true);
      setError(null);
      
      if (!id) return;
      
      const pitchData = {
        ...data,
        tags,
      };
      
      const updatedPitch = await updatePitch(id, pitchData);
      navigate(`/pitch/${updatedPitch._id}`);
    } catch (error: any) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to update pitch. Please try again.'
      );
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
            <button 
              onClick={() => navigate(-1)} 
              className="mt-4 btn btn-secondary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold mb-6">Edit Pitch</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  className={`input-field ${errors.status ? 'border-red-500' : ''}`}
                  {...register('status', { required: 'Please select a status' })}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status} className="capitalize">
                      {status}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
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
                  {...register('website')}
                />
              </div>
            </div>

            <div className="pt-6 flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn btn-primary flex-1 py-3 flex items-center justify-center"
                disabled={submitting}
              >
                {submitting ? (
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
                  'Save Changes'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditPitchPage;