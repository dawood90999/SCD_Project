import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Tag, 
  Mail, 
  Phone, 
  Globe, 
  Edit, 
  Trash2, 
  Eye, 
  MessageSquare,
  Send
} from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { fetchPitchById, createComment, deletePitch, PitchData } from '../services/api';

const PitchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [pitch, setPitch] = useState<PitchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const getPitchDetails = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        const data = await fetchPitchById(id);
        setPitch(data);
      } catch (error) {
        setError('Failed to load pitch details. The pitch might have been removed or you may not have access.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getPitchDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || !id) return;
    
    try {
      setCommentLoading(true);
      await createComment(id, comment);
      
      // Refresh pitch data to show new comment
      const updatedPitch = await fetchPitchById(id);
      setPitch(updatedPitch);
      setComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setDeleteLoading(true);
      await deletePitch(id);
      navigate('/pitches');
    } catch (error) {
      console.error('Failed to delete pitch:', error);
      setError('Failed to delete pitch. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !pitch) {
    return (
      <div className="pt-24">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error || 'Failed to load pitch details.'}</p>
          <Link to="/pitches" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            Back to all pitches
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && pitch.user._id === user._id;

  return (
    <div className="pt-24">
      <div className="mb-6">
        <Link to="/pitches" className="text-blue-600 hover:text-blue-800 flex items-center">
          &larr; Back to all pitches
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{pitch.title}</h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(pitch.status || 'open')}`}>
                {pitch.status || 'open'}
              </span>
            </div>

            <div className="flex items-center text-gray-500 text-sm mb-6">
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {formatDate(pitch.createdAt)}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Eye size={14} className="mr-1" />
                {pitch.views} views
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <MessageSquare size={14} className="mr-1" />
                {pitch.comments.length} comments
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-md font-medium">
                {pitch.category}
              </span>
              {pitch.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-md flex items-center">
                  <Tag size={14} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose max-w-none mb-8">
              {pitch.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {isOwner && (
              <div className="flex gap-4 border-t pt-6">
                <Link to={`/edit-pitch/${pitch._id}`} className="btn btn-secondary flex items-center">
                  <Edit size={18} className="mr-2" />
                  Edit Pitch
                </Link>
                <button 
                  onClick={() => setDeleteConfirm(true)} 
                  className="btn bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 flex items-center"
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete Pitch
                </button>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <motion.div 
                  className="bg-white rounded-lg p-6 max-w-md mx-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <h3 className="text-xl font-bold mb-4">Delete Pitch</h3>
                  <p className="mb-6">Are you sure you want to delete this pitch? This action cannot be undone.</p>
                  <div className="flex justify-end gap-4">
                    <button 
                      onClick={() => setDeleteConfirm(false)}
                      className="btn btn-secondary"
                      disabled={deleteLoading}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="btn bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Comments Section */}
          <motion.div 
            className="card p-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-6">Comments ({pitch.comments.length})</h2>
            
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="mb-4">
                  <textarea
                    className="input-field min-h-[100px]"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn btn-primary flex items-center"
                    disabled={commentLoading}
                  >
                    {commentLoading ? (
                      <span>Posting...</span>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Post Comment
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            ) : (
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <p>
                  Please <Link to="/login" className="text-blue-600 font-medium">log in</Link> to leave a comment.
                </p>
              </div>
            )}

            {pitch.comments.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pitch.comments.map((comment, index) => (
                  <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        <span className="text-sm font-medium">{comment.name.charAt(0)}</span>
                      </div>
                      <div>
                        <span className="font-medium">{comment.name}</span>
                        <span className="text-gray-500 text-sm ml-2">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div 
            className="card p-6 sticky top-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Created by</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  {pitch.user.profileImage ? (
                    <img src={pitch.user.profileImage} alt={pitch.user.name} className="w-12 h-12 rounded-full" />
                  ) : (
                    <span className="text-lg font-medium">{pitch.user.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="font-medium">{pitch.user.name}</div>
                  {pitch.user.bio && (
                    <div className="text-gray-600 text-sm mt-1">{pitch.user.bio}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail size={18} className="text-gray-500 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Email</div>
                  <a href={`mailto:${pitch.contactEmail}`} className="text-blue-600 hover:text-blue-800">
                    {pitch.contactEmail}
                  </a>
                </div>
              </div>
              
              {pitch.contactPhone && (
                <div className="flex items-start">
                  <Phone size={18} className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Phone</div>
                    <a href={`tel:${pitch.contactPhone}`} className="text-blue-600 hover:text-blue-800">
                      {pitch.contactPhone}
                    </a>
                  </div>
                </div>
              )}
              
              {pitch.website && (
                <div className="flex items-start">
                  <Globe size={18} className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Website</div>
                    <a 
                      href={pitch.website.startsWith('http') ? pitch.website : `https://${pitch.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {pitch.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PitchDetailPage;