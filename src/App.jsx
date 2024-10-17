import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DocumentList from './components/DocumentList';
import DocumentEditor from './components/DocumentEditor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/documents" element={<DocumentList />} /> 
        <Route path="/edit/:documentKey" element={<DocumentEditor />} />
      </Routes>
    </Router>
  );
}

export default App;

