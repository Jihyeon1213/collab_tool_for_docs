import { useUserStore } from "../store";
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, clearUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth); 
    clearUser(); 
    navigate('/'); 
  };

  return (
    <header className="header">
      {user ? (
        <div>
          <span>{user.displayName}</span>
          <button onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      ) : (
        <p>로그인이 필요합니다</p>
      )}
    </header>
  );
};

export default Header;
