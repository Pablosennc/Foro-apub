import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!email) {
      setError("Por favor, ingresa tu correo institucional.");
      return;
    }

    // Le decimos a Supabase que envíe el correo y a dónde redirigir después del clic
    const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    if (supabaseError) {
      setError("Error al intentar enviar el correo. Verifica tu dirección.");
      console.error(supabaseError);
    } else {
      setMensaje("¡Listo! Revisa tu bandeja de entrada o spam para restablecer tu contraseña.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}><span>Foro APUB</span></header>
      <main className={styles.container}>
        <h1 className={styles.title}>Recuperar Contraseña</h1>
        <h3 className={styles.subtitle}>Te enviaremos un enlace de recuperación</h3>
        <div className={styles.card}>
          <form onSubmit={handleResetRequest} className={styles.formGroup}>
            <input 
              type="email" 
              placeholder="Correo Institucional (@alu.uct.cl)" 
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "-10px" }}>{error}</p>}
            {mensaje && <p style={{ color: "green", fontSize: "0.85rem", marginTop: "-10px" }}>{mensaje}</p>}
            <button type="submit" className={styles.buttonPrimary}>Enviar Enlace</button>
          </form>
          <div className={styles.linksContainer}>
            <button type="button" className={styles.linkButton} onClick={() => navigate("/login")}>
              Volver al Inicio de Sesión
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;