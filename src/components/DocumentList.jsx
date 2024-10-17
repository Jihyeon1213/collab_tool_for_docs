import { useEffect, useState } from 'react';
import { useUserStore } from '../store';
import { auth, db } from '../firebase';
import { ref, onValue, remove, update } from 'firebase/database';
import CreateDocumentModal from './CreateDocumentModal';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import { onAuthStateChanged } from 'firebase/auth';

const DocumentList = () => {
  const [documentList, setDocumentList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editDocumentId, setEditDocumentId] = useState(null); 
  const { user, setUser } = useUserStore();
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
    if (!user) return; 

    onValue(ref(db, '/users/'), (snapshot) => {
      const data = snapshot.val();
  
      if (data) {
        const userDocuments = Object.keys(data)
          .filter(documentKey => data[documentKey].ownerUid === user.uid) 
          .map(documentKey => ({
            id: documentKey,
            title: data[documentKey].title,
          }));
  
        setDocumentList(userDocuments); 
      } else {
        setDocumentList([]); 
      }
    });
  }, [user]);
  

  const handleCreateDocument = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditTitle = (documentId) => {
    setEditDocumentId(documentId); 
  };

  const handleTitleChange = (e, documentId) => {
    const newTitle = e.target.value;
    const updatedDocuments = documentList.map((doc) =>
      doc.id === documentId ? { ...doc, title: newTitle } : doc
    );
    setDocumentList(updatedDocuments); 

    if (user) {
      const documentRef = ref(db, '/users/' + documentId);
      update(documentRef, { title: newTitle }); 
    }
  };

  const handleDeleteDocument = (documentId) => {
    remove(ref(db, '/users/'+ documentId));
    setDocumentList((prevDocuments) => prevDocuments.filter(doc => doc.id !== documentId));
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!user) {
    setTimeout(() => navigate('/'), 2000);
    return <h2>문서 목록을 보려면 로그인 해주세요!</h2>
  }

  return (
    <div>
      <Header />
      <h1>문서 목록</h1>
      <button onClick={handleCreateDocument}>새 문서 생성</button>
      <ul>
        {documentList.map((document) => (
          <li key={document.id}>
            {editDocumentId === document.id ? (
              <>
              <input
                value={document.title}
                onChange={(e) => handleTitleChange(e, document.id)}
              />
              <button onClick={() => setEditDocumentId(null)}>확인</button>
              </>
            ) : (
              <>
              <Link to={`/edit/${document.id}`}>{document.title}</Link>
              <button onClick={() => handleEditTitle(document.id)}>제목 수정</button>
              <button onClick={() => handleDeleteDocument(document.id)}>삭제</button>           
              </>
            )}
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <CreateDocumentModal handleCloseModal={handleCloseModal} />
      )}
    </div>
  );
};

export default DocumentList;


