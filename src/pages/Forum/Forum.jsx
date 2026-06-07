// src/pages/Forum/Forum.jsx
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";

function Forum() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Bienvenido al Foro APUB</h1>
      <p>Aquí construiremos los hilos y discusiones.</p>
      <button 
        onClick={handleLogout}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Forum;