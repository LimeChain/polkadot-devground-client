import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';
let accessToken: string | null = null;
interface AuthResponse {
  jwtToken: string;
}

const login = async (code: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, { code }, { withCredentials: true });
  if (response.data.jwtToken) {
    accessToken = response.data.jwtToken;
  }
  return response.data;
};

const logout = (): void => {
  accessToken = null;
};

const getAccessToken = (): string | null => accessToken;

const refreshToken = async (): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/refresh`, {}, { withCredentials: true });
  if (response.data.jwtToken) {
    accessToken = response.data.jwtToken;
  }
  return response.data;
};

export default {
  login,
  logout,
  getAccessToken,
  refreshToken,
};
