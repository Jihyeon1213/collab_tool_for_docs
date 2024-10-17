import { useState } from 'react';
import { db } from '../firebase';
import { ref, push, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUserStore } from '../store';


const CreateDocumentModal = ({ handleCloseModal }) => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const { user } = useUserStore();

  const handleCreateDocument = () => {
    if (!title) return;

    const documentKey = push(ref(db, '/users/')).key;

    set(ref(db, '/users/' + documentKey), {
      title,
      content: '',
      ownerUid: user.uid
    });

    handleCloseModal();

    navigate(`/edit/${documentKey}`);
  };

  return (
    <div>
      <h2>새 문서 생성</h2>
      <input
        type="text"
        placeholder="문서 제목을 입력해주세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleCreateDocument}>생성</button>
      <button onClick={handleCloseModal}>취소</button>
    </div>
  );
};

CreateDocumentModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
};

export default CreateDocumentModal;
