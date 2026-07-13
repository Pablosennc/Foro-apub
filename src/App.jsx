import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Forum from './pages/Forum/Forum';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'; // NUEVO
import ResetPassword from './pages/ResetPassword/ResetPassword';     // NUEVO

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/foro" element={<Forum />} />
        
        {/* Nuevas rutas de recuperación */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;