import api from './api';

interface LoginData {
  username: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await api.post('/login', data);
  return response.data; 
};

export const register = async (data: LoginData) => {
  const response = await api.post('/register', data);
  return response.data;
};
