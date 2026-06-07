import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabaseClient'; // Importamos Supabase para ver la sesión

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Forum from './pages/Forum/Forum';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Para que no parpadee al cargar

  useEffect(() => {
    // 1. Revisar si ya hay una sesión guardada al abrir la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Escuchar activamente si el usuario inicia o cierra sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Mostrar algo muy básico mientras revisa la sesión
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>Cargando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Raíz: Si hay sesión va al foro, si no, al login */}
        <Route path="/" element={session ? <Navigate to="/foro" replace /> : <Navigate to="/login" replace />} />
        
        {/* Rutas públicas (solo accesibles si NO estás logueado) */}
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/foro" replace />} />
        <Route path="/register" element={!session ? <Register /> : <Navigate to="/foro" replace />} />
        
        {/* Rutas protegidas (solo accesibles si SÍ estás logueado) */}
        <Route path="/foro" element={session ? <Forum /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;