import { useUserStore } from "../store"
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      provider.setCustomParameters({
        prompt: "select_account",
      });
      
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); 
      navigate('/documents');
    } catch (error) {
      console.error("로그인 실패", error);
    }
  };

  return (
    <div className="container">
      <h1>함께 문서 만들기</h1>
      <button onClick={handleLogin} className="loginButton">
        구글로 로그인하기
      </button>
    </div>
  );
};

export default LoginPage;
