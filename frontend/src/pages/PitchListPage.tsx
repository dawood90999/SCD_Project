import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import PitchCard from '../components/ui/PitchCard';
import { fetchPitches, PitchData, PitchListResponse } from '../services/api';

const PitchListPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [pitches, setPitches] = useState<PitchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState(queryParams.get('keyword') || '');
  const [category, setCategory] = useState(queryParams.get('category') || '');
  const [status, setStatus] = useState(queryParams.get('status') || '');
  const [page, setPage] = useState(Number(queryParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPitches, setTotalPitches] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // List of available categories
  const categories = ['Technology', 'Health', 'Finance', 'Education', 'Environment', ''];
  const statuses = ['open', 'in progress', 'closed', ''];

  useEffect(() => {
    const fetchPitchesData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const keywordParam = queryParams.get('keyword') || '';
        const categoryParam = queryParams.get('category') || '';
        const statusParam = queryParams.get('status') || '';
        const pageParam = Number(queryParams.get('page')) || 1;
        
        setKeyword(keywordParam);
        setCategory(categoryParam);
        setStatus(statusParam);
        setPage(pageParam);
        
        const result: PitchListResponse = await fetchPitches(
          keywordParam, 
          categoryParam,
          statusParam,
          pageParam
        );
        
        setPitches(result.pitches);
        setTotalPages(result.pages);
        setTotalPitches(result.totalPitches);
      } catch (error) {
        setError('Failed to load pitches. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPitchesData();
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    
    navigate(`/pitches?${params.toString()}`);
    setIsFilterOpen(false);
  };

  const handleCategoryChange = (newCategory: string) => {
    if (category === newCategory) {
      setCategory('');
    } else {
      setCategory(newCategory);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (status === newStatus) {
      setStatus('');
    } else {
      setStatus(newStatus);
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(location.search);
    
    if (newPage === 1) {
      params.delete('page');
    } else {
      params.set('page', newPage.toString());
    }
    
    navigate(`/pitches?${params.toString()}`);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Pitches</h1>
        <p className="text-gray-600">
          Browse through {totalPitches} innovative ideas looking for support
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Search and Filters */}
        <div className="w-full lg:w-1/4">
          <div className="card sticky top-24">
            <div className="p-5 border-b">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder="Search pitches..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <Search 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </form>
            </div>

            {/* Filter toggle for mobile */}
            <div className="p-5 lg:hidden">
              <button 
                onClick={toggleFilter}
                className="flex items-center justify-between w-full p-2 bg-gray-100 rounded-md"
              >
                <span className="font-medium">Filters</span>
                <Filter size={18} />
              </button>
            </div>

            {/* Filters - hidden on mobile until toggled */}
            <div className={`${isFilterOpen || 'hidden lg:block'}`}>
              <div className="p-5 border-b">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat, index) => (
                    cat && (
                      <div key={index} className="flex items-center">
                        <button
                          className={`flex items-center w-full px-2 py-1.5 rounded-md text-left ${
                            category === cat 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleCategoryChange(cat)}
                        >
                          {cat}
                        </button>
                      </div>
                    )
                  ))}
                  {category && (
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                      onClick={() => setCategory('')}
                    >
                      Clear category
                    </button>
                  )}
                </div>
              </div>

              <div className="p-5 border-b">
                <h3 className="font-semibold mb-3">Status</h3>
                <div className="space-y-2">
                  {statuses.map((stat, index) => (
                    stat && (
                      <div key={index} className="flex items-center">
                        <button
                          className={`flex items-center w-full px-2 py-1.5 rounded-md text-left capitalize ${
                            status === stat 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleStatusChange(stat)}
                        >
                          {stat}
                        </button>
                      </div>
                    )
                  ))}
                  {status && (
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                      onClick={() => setStatus('')}
                    >
                      Clear status
                    </button>
                  )}
                </div>
              </div>

              <div className="p-5">
                <button 
                  onClick={handleSearch}
                  className="btn btn-primary w-full"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pitch List */}
        <div className="w-full lg:w-3/4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
              {error}
            </div>
          ) : pitches.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No pitches found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button 
                onClick={() => {
                  setKeyword('');
                  setCategory('');
                  setStatus('');
                  navigate('/pitches');
                }}
                className="btn btn-secondary"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {pitches.map((pitch) => (
                  <PitchCard key={pitch._id} pitch={pitch} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`p-2 rounded-md ${
                        page === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    {[...Array(totalPages).keys()].map((num) => (
                      <button
                        key={num + 1}
                        onClick={() => handlePageChange(num + 1)}
                        className={`w-10 h-10 rounded-md ${
                          page === num + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {num + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className={`p-2 rounded-md ${
                        page === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PitchListPage;