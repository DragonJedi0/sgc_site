import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PersonnelList from './pages/PersonnelList';
import PersonnelDetail from './pages/PersonnelDetail';
import PersonnelForm from './pages/PersonnelForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PersonnelList />} />
        <Route path="/personnel/:id" element={<PersonnelDetail />} />
        <Route path="/personnel/new" element={<PersonnelForm />} />
        <Route path="/personnel/:id/edit" element={<PersonnelForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;