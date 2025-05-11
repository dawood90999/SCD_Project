import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL ||'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interfaces
export interface PitchData {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  status?: string;
  views: number;
  comments: Comment[];
  createdAt: string;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
    email?: string;
    bio?: string;
  };
}

export interface Comment {
  _id: string;
  user: string;
  name: string;
  text: string;
  createdAt: string;
}

export interface PitchListResponse {
  pitches: PitchData[];
  page: number;
  pages: number;
  totalPitches: number;
}

// Pitch API calls
export const fetchPitches = async (
  keyword = '',
  category = '',
  status = '',
  pageNumber = 1
): Promise<PitchListResponse> => {
  try {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    params.append('pageNumber', pageNumber.toString());

    const { data } = await api.get(`/pitches?${params.toString()}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchPitchById = async (id: string): Promise<PitchData> => {
  try {
    const { data } = await api.get(`/pitches/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createPitch = async (pitchData: Partial<PitchData>): Promise<PitchData> => {
  try {
    const { data } = await api.post('/pitches', pitchData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updatePitch = async (id: string, pitchData: Partial<PitchData>): Promise<PitchData> => {
  try {
    const { data } = await api.put(`/pitches/${id}`, pitchData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deletePitch = async (id: string) => {
  try {
    const { data } = await api.delete(`/pitches/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createComment = async (pitchId: string, text: string) => {
  try {
    const { data } = await api.post(`/pitches/${pitchId}/comments`, { text });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserPitches = async (userId: string): Promise<PitchData[]> => {
  try {
    const { data } = await api.get(`/pitches/user/${userId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export default api;
