import axios from 'axios';

import { SERVER_URL } from '@constants/auth';
import { snippets } from '@constants/snippets';

import authService from './authService';

export const uploadSnippet = async () => {
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

export const getGistContent = async (i) => {
  const jwtToken = await authService.getJwtToken();
  if (!jwtToken) {
    return;
  }

  try {
    const { data } = await axios.get(`${SERVER_URL}/gists/${'74ee49afbb0c5faedf0e9e0f87b2a9bf'}`, { withCredentials: true });
    console.log('data', data);
    return data;
  } catch (error) {
    console.log('error', error);
  }
};
