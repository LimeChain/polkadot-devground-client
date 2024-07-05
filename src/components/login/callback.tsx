import {
  useEffect,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';

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
      const url = 'http://localhost:3000/auth/login';
 
      const body = { code };
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const { jwtToken } = await res.json();
      localStorage.setItem('jwt', jwtToken);
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