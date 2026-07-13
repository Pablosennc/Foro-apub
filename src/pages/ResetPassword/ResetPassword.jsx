import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import styles from "./ResetPassword.module.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // Actualiza la contraseña del usuario actualmente autenticado (por el enlace del correo)
    const { error: supabaseError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (supabaseError) {
      setError("Hubo un error al actualizar tu contraseña. El enlace puede haber expirado.");
    } else {
      setMensaje("¡Contraseña actualizada con éxito! Redirigiendo...");
      setTimeout(() => navigate("/foro"), 2000); // Lo mandamos al foro después de 2 segundos
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}><span>Foro APUB</span></header>
      <main className={styles.container}>
        <h1 className={styles.title}>Crea tu nueva contraseña</h1>
        <h3 className={styles.subtitle}>Asegúrate de no olvidarla esta vez</h3>
        <div className={styles.card}>
          <form onSubmit={handleUpdatePassword} className={styles.formGroup}>
            <input 
              type="password" 
              placeholder="Nueva Contraseña" 
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {error && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "-10px" }}>{error}</p>}
            {mensaje && <p style={{ color: "green", fontSize: "0.85rem", marginTop: "-10px" }}>{mensaje}</p>}
            <button type="submit" className={styles.buttonPrimary}>Actualizar Contraseña</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;