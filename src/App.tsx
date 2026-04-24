import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PersonnelList from './pages/PersonnelList';
import PersonnelDetail from './pages/PersonnelDetail';
import PersonnelForm from './pages/PersonnelForm';
import { PATHS, ROUTES } from './lib/paths';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.PERSONNEL_LIST} element={<PersonnelList />} />
        <Route path={ROUTES.PERSONNEL_DETAIL} element={<PersonnelDetail />} />
        <Route path={PATHS.PERSONNEL_NEW} element={<PersonnelForm />} />
        <Route path={ROUTES.PERSONNEL_EDIT} element={<PersonnelForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;