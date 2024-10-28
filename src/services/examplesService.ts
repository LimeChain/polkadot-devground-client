import axios from 'axios';

import { SERVER_URL } from '@constants/auth';

import authService from './authService';

interface GistFile {
  content: string;
}

interface UploadCustomExampleData {
  code: string;
  description: string;
  exampleName: string;
}

const uploadExample = async (data: UploadCustomExampleData) => {
  const jwtToken = await authService.getJwtToken();

  const files: { [key: string]: GistFile } = {
    'snippet.tsx': {
      content: data.code,
    },
  };

  const body = {
    name: data.exampleName,
    description: data.description,
    files,
    publicGist: true,
  };

  const response = await axios.post(`${SERVER_URL}/gists`, body, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  return response.data;
};

const getUserExamples = async () => {
  const jwtToken = await authService.getJwtToken();

  const response = await axios.get(`${SERVER_URL}/gists`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  });

  return response.data;
};

const getExampleContent = async (id: string) => {
  try {
    const { data } = await axios.get(`${SERVER_URL}/gists/${id}`, { withCredentials: true });

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

const updateExampleInfo = async (id: string, name: string, description: string) => {
  const body = {
    name,
    files: {
      'description.txt': {
        content: description,
      },
    },
  };

  const { data } = await axios.patch(`${SERVER_URL}/gists/edit-info/${id}`, body);

  return data;

};

const updateExampleContent = async (id: string, data: string) => {
  const files: { [key: string]: GistFile } = {
    'snippet.tsx': {
      content: data,
    },
  };

  const body = {
    files,
  };

  try {
    const gists = await axios.patch(`${SERVER_URL}/gists/edit-content/${id}`, body);
    return gists;
  } catch (error) {
    console.log('error', error);
  }

};

const deleteExample = async (id: string) => {
  const { data } = await axios.delete(`${SERVER_URL}/gists/${id}`, { withCredentials: true });
  return data;
};

export default {
  uploadExample,
  getUserExamples,
  getExampleContent,
  updateExampleContent,
  updateExampleInfo,
  deleteExample,
};
