import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PersonnelList from './pages/PersonnelList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PersonnelList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;