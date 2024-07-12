import axios from 'axios';

import { SERVER_URL } from '@constants/auth';
import { snippets } from '@views/codeEditor/snippets';

import authService from './authService';

export const uploadSnippet = async () => {

  const jwtToken = authService.getJwtToken();

  if (!jwtToken) {
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
  const response = await axios.post(`${SERVER_URL}/gists`, body, { withCredentials: true });

  console.log('response', response);
};
