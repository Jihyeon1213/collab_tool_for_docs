import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { ref, onValue, update } from 'firebase/database';
import { useUserStore } from '../store';
import Header from './Header';
import { onAuthStateChanged } from 'firebase/auth';

const DocumentEditor = () => {
  const { documentKey } = useParams(); 
  const [content, setContent] = useState('');
  const { user, setUser } = useUserStore(); 
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('')
  const navigate = useNavigate();

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
  
  useEffect(() => {
    if (!documentKey || !user) return;
    
    onValue(ref(db, '/users/' + documentKey), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTitle(data.title);
        setContent(data.content);
      }
    }); 
  }, [documentKey, user]);
  
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (content && documentKey && user) {
        const documentRef = ref(db, '/users/' + documentKey); 
        update(documentRef, {
          content: content, 
        });
      }
    }, 20000);


    return () => clearInterval(saveInterval); 
  }, [content, documentKey, user]);

  if (loading) {
    return <div>로딩 중...</div>; 
  }


  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(e.target.value);

    if (user) {
      const documentRef = ref(db, "/users/" + documentKey); 
      update(documentRef, {
        content: newContent, 
      });
    }
  };

  if (!user) {
    setTimeout(() => navigate('/'), 2000);
    return <div>로그인 후 문서 편집이 가능합니다.</div>
  }

  return (
    <div>
      <Header /> 
      <h1>{title}</h1>
      <textarea
        value={content}
        onChange={handleContentChange}
        rows="30" cols="100"
      />
    </div>
  );
};

export default DocumentEditor;

