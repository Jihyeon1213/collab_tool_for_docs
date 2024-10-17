import { useEffect, useState } from 'react';
import { useUserStore } from '../store';
import { auth, db } from '../firebase';
import { ref, onValue, remove } from 'firebase/database';
import CreateDocumentModal from './CreateDocumentModal';
import { Link } from 'react-router-dom';
import Header from './Header';
import { onAuthStateChanged } from 'firebase/auth';

const DocumentList = () => {
  const [documentList, setDocumentList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUserStore();

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
    const uid = user.uid;

    onValue(ref(db, '/users/' + uid), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const documentList = Object.keys(data).map((documentKey) => ({
          id: documentKey,
          title: data[documentKey].title,
        }));
        setDocumentList(documentList);
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

  const handleDeleteDocument = (documentId) => {
    const uid = user.uid;

    remove(ref(db, '/users/' + uid + '/' + documentId));
    setDocumentList((prevDocuments) => prevDocuments.filter(doc => doc.id !== documentId));
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!user) {
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
            <Link to={`/edit/${document.id}`}>{document.title}</Link>
            <button onClick={() => handleDeleteDocument(document.id)}>삭제</button>
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

