import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Diario from './pages/Diario';
import AdminLayout from './pages/admin/Layout';
import Equipos from './pages/admin/Equipos';

import Fixture from './pages/admin/Fixture';
import Resultados from './pages/admin/Resultados';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diario" element={<Diario />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="equipos" element={<Equipos />} />

          <Route path="fixture" element={<Fixture />} />
          <Route path="resultados" element={<Resultados />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
