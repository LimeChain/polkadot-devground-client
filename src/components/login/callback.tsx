import {
  useEffect,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@stores/auth';

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

      if (token) {
        navigate('/');
      }
    };

    void getAccessToken();
    //get the access token from the code

  }, [navigate, login]);

  return (
    <div>
      <h1>Successfully authorized with GitHub</h1>
    </div>
  );
};

export default Callback;
