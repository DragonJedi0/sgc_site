import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PersonnelList from './pages/PersonnelList';
import PersonnelDetail from './pages/PersonnelDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PersonnelList />} />
        <Route path="/personnel/:id" element={<PersonnelDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;