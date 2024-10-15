import axios from 'axios';

import { SERVER_URL } from '@constants/auth';
import { snippets } from '@constants/snippets';

import authService from './authService';

const uploadSnippet = async () => {
  try {
    const jwtToken = await authService.getJwtToken();
    if (!jwtToken) {
      console.log('no jwt token');
      return;
    }

    const snippet = snippets[0].code;
    const files = {
      'snippet.tsx': {
        content: snippet,
      },
      'package.json': {
        content: 'snippet2 content',
      },
      'readme.txt': {
        content: 'readme content',
      },
    };

    const body = {
      description: 'Snippet description',
      files,
      publicGist: true,
    };
    await axios.post(`${SERVER_URL}/gists`, body);
  } catch (error) {
    console.log('error', error);
  }

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

    // Return the content of the snippet.tsx file from the gist
    return data['snippet.tsx'].content;
  } catch (error) {
    console.log('error', error);
  }
};

export default {
  uploadSnippet,
  getUserGists,
  getGistContent,
};
