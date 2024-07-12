import {
  useEffect,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { STORAGE_AUTH_SUCCESSFUL_REDIRECT_TO } from '@constants/auth';
import { useAuthStore } from '@stores';

const Callback = () => {
  const navigate = useNavigate();
  const codeUsed = useRef<boolean>(false);

  const { login } = useAuthStore.use.actions();

  useEffect(() => {
    const getAccessToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (codeUsed.current || !code) {
        return;
      }

      codeUsed.current = true;
      const token = await login(code);
      const successRedirectTo = window.localStorage.getItem(STORAGE_AUTH_SUCCESSFUL_REDIRECT_TO);

      if (token && successRedirectTo) {
        navigate(successRedirectTo || '/');
      }
    };

    void getAccessToken();

  }, [navigate, login]);

  return (
    <div>
      <h1>Successfully authorized with GitHub</h1>
    </div>
  );
};

export default Callback;
