import { useUserStore } from "../store"
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

const LoginPage = () => {
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); 
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="container">
      <h1>Google Dogs</h1>
      <button onClick={handleLogin} className="loginButton">
        Login by Google!
      </button>
    </div>
  );
};

export default LoginPage;
