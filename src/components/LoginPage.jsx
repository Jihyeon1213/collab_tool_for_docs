import { useUserStore } from "../store"
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

const LoginPage = () => {
  const { user, setUser } = useUserStore(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); 
        setLoading(false);
      } else {
        setLoading(false); 
      }
    });
  }, [setUser]);
  
  useEffect(()=> {
    if(user) {
      setLoading(true);
      setTimeout(()=>navigate('/documents'), 800);      
    }
  },[navigate, user])

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

  if (loading) {
    return <div>로딩 중...</div>; 
  }

  return (
    <div>
      <h1>함께 문서 만들기</h1>
      <button onClick={handleLogin}>
        구글로 로그인하기
      </button>
    </div>
  );
};

export default LoginPage;
