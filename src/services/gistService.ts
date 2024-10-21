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

const uploadCustomExample = async (data: UploadCustomExampleData) => {
  const jwtToken = await authService.getJwtToken();
  if (!jwtToken) {
    console.log('no jwt token');
    return;
  }

  const files: { [key: string]: GistFile } = {
    'snippet.tsx': {
      content: data.code,
    },
    'description.txt': {
      content: data.description,
    },
  };

  const body = {
    name: data.exampleName,
    files,
    publicGist: true,
  };

  const examples = await axios.post(`${SERVER_URL}/gists`, body);
  return examples;
};

const getUserGists = async () => {
  const jwtToken = await authService.getJwtToken();

  if (!jwtToken) {
    console.log('no jwt token');
    return;
  }

  try {
    const { data } = await axios.get(`${SERVER_URL}/gists`, { withCredentials: true });
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

const getGistContent = async (id: string) => {
  const jwtToken = await authService.getJwtToken();
  if (!jwtToken) {
    console.log('no jwt token');
    return;
  }

  try {
    const { data } = await axios.get(`${SERVER_URL}/gists/${id}`, { withCredentials: true });

    return {
      code: data['snippet.tsx'].content,
      description: data['description.txt'].content,
    };
  } catch (error) {
    console.log('error', error);
  }
};

const deleteExample = async (id: string) => {
  const jwtToken = await authService.getJwtToken();
  if (!jwtToken) {
    console.log('no jwt token');
    return;
  }

  const { data } = await axios.delete(`${SERVER_URL}/gists/${id}`, { withCredentials: true });
  return data;
};

export default {
  uploadCustomExample,
  getUserGists,
  getGistContent,
  deleteExample,
};
