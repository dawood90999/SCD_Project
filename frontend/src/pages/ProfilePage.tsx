import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save, Eye, AlertCircle, Plus } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { getUserPitches, PitchData } from '../services/api';
import PitchCard from '../components/ui/PitchCard';

interface ProfileFormInputs {
  name: string;
  email: string;
  bio: string;
  profileImage: string;
  password: string;
  confirmPassword: string;
}

const ProfilePage: React.FC = () => {
  const { user, updateProfile, error: authError, loading: authLoading } = useContext(AuthContext);
  const [userPitches, setUserPitches] = useState<PitchData[]>([]);
  const [loadingPitches, setLoadingPitches] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors },
    reset
  } = useForm<ProfileFormInputs>();

  const password = watch('password', '');

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        bio: user.bio || '',
        profileImage: user.profileImage || '',
      });
      
      const fetchUserPitches = async () => {
        try {
          setLoadingPitches(true);
          const pitches = await getUserPitches(user._id);
          setUserPitches(pitches);
        } catch (error) {
          console.error('Failed to fetch user pitches:', error);
        } finally {
          setLoadingPitches(false);
        }
      };
      
      fetchUserPitches();
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormInputs) => {
    try {
      // Only include password if it was entered
      const updateData = {
        name: data.name,
        email: data.email,
        bio: data.bio,
        profileImage: data.profileImage,
        ...(data.password ? { password: data.password } : {}),
      };
      
      await updateProfile(updateData);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="flex mb-6 border-b">
          <button
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Details
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === 'pitches'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pitches')}
          >
            Your Pitches
          </button>
        </div>
        
        {activeTab === 'profile' ? (
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {showSuccess && (
              <motion.div 
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                Profile updated successfully!
              </motion.div>
            )}
            
            {authError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
                <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={18} />
                <span>{authError}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image URL (Optional)
                  </label>
                  <input
                    id="profileImage"
                    type="text"
                    className="input-field"
                    placeholder="https://example.com/your-image.jpg"
                    {...register('profileImage')}
                  />
                  <div className="mt-3 flex justify-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
                      {watch('profileImage') ? (
                        <img 
                          src={watch('profileImage')} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-semibold">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-2/3">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio (Optional)
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      className="input-field"
                      placeholder="Tell others about yourself..."
                      {...register('bio')}
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Change Password (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                      {...register('password', {
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      {...register('confirmPassword', {
                        validate: value => !password || value === password || 'Passwords do not match'
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-primary flex items-center"
                  disabled={authLoading}
                >
                  {authLoading ? (
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
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Pitches</h2>
              <Link 
                to="/create-pitch"
                className="btn btn-accent flex items-center"
              >
                <Plus size={18} className="mr-1" />
                New Pitch
              </Link>
            </div>
            
            {loadingPitches ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : userPitches.length === 0 ? (
              <div className="bg-gray-50 text-center py-12 rounded-lg">
                <h3 className="text-lg font-medium mb-2">You haven't created any pitches yet</h3>
                <p className="text-gray-600 mb-6">Share your idea with potential investors and partners</p>
                <Link 
                  to="/create-pitch"
                  className="btn btn-primary inline-flex items-center"
                >
                  <Plus size={18} className="mr-1" />
                  Create Your First Pitch
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {userPitches.map(pitch => (
                  <PitchCard key={pitch._id} pitch={pitch} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;