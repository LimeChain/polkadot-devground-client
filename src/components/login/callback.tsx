import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { STORAGE_AUTH_SUCCESSFUL_REDIRECT_TO } from '@constants/auth';
import { useStoreAuth } from '@stores';
import { getSearchParam } from '@utils/helpers';

const Callback = () => {
  const navigate = useNavigate();
  const codeUsed = useRef<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useStoreAuth.use.actions();

  useEffect(() => {
    const getAccessToken = async () => {
      const code = getSearchParam('code');
      const error = getSearchParam('error');

      if (error) {
        setError(error);
        return;
      }

      if (codeUsed.current || !code) {
        return;
      }

      codeUsed.current = true;
      const token = await login(code);
      const successRedirectTo = window.localStorage.getItem(STORAGE_AUTH_SUCCESSFUL_REDIRECT_TO);

      if (token && successRedirectTo) {
        navigate(successRedirectTo || '/');
        window.localStorage.removeItem(STORAGE_AUTH_SUCCESSFUL_REDIRECT_TO);
      }
    };

    void getAccessToken();

  }, [navigate, login]);

  if (error) {
    return (
      <div className="flex size-full flex-col items-center justify-center">
        <h1>Failed to authorize with GitHub</h1>
        <p>{error}</p>
      </div>
    );

  }

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <h1>Successfully authorized with GitHub</h1>
    </div>
  );
};

export default Callback;
