import {
  useEffect,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';

import authService from '../../services/authService';
const Callback = () => {
  const navigate = useNavigate();
  const codeUsed = useRef<boolean>(false);

  useEffect(() => {
    const getAccessToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
 
      if (codeUsed.current || !code) {
        return;
      }

      codeUsed.current = true;
      const jwt = await authService.login(code);
      navigate('/');
    };

    void getAccessToken();
    //get the access token from the code

  }  
  , [navigate]);
    
  return (
    <div>
      <h1>Successfully logged with github</h1>
    </div>
  );
};

export default Callback;