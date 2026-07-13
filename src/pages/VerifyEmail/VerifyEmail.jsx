import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
// Reciclamos el CSS del Register para mantener el diseño consistente
import styles from "../Register/Register.module.css"; 

function VerifyEmail() {
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Rescatamos el email que le enviamos desde el Register
  const emailToVerify = location.state?.email || "";

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!emailToVerify) {
      setError("No se detectó un correo. Por favor, vuelve a registrarte.");
      return;
    }

    if (otpCode.length !== 8) {
      setError("El código debe tener exactamente 8 dígitos.");
      return;
    }

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: emailToVerify,
      token: otpCode,
      type: 'signup'
    });

    if (verifyError) {
      setError("El código es incorrecto o ha expirado.");
    } else {
      setMensaje("¡Cuenta verificada exitosamente!");
      await supabase.auth.signOut(); // Limpiamos la sesión temporal
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}><span>Foro APUB</span></header>
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Verifica tu cuenta</h1>
        <h3 className={styles.subtitle}>
          Ingresa el código enviado a: <br/> 
          <strong>{emailToVerify || "tu correo"}</strong>
        </h3>
        <div className={styles.card}>
          <form onSubmit={handleVerifyOtp} className={styles.formGroup}>
            <input 
              type="text" 
              placeholder="Código de 8 dígitos" 
              className={styles.input} 
              value={otpCode} 
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              maxLength="8"
              style={{ 
                textAlign: 'center', 
                fontSize: '1.2rem', 
                // El truco de magia: solo aplica el espaciado si hay texto escrito
                letterSpacing: otpCode.length > 0 ? '0.5rem' : 'normal' 
              }}
            />
            {error && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "-10px" }}>{error}</p>}
            {mensaje && <p style={{ color: "green", fontSize: "0.85rem", marginTop: "-10px", fontWeight: "bold" }}>{mensaje}</p>}
            <button type="submit" className={styles.buttonPrimary}>Verificar Código</button>
          </form>
          <div className={styles.linksContainer}>
            <button type="button" className={styles.linkButton} onClick={() => navigate("/register")}>
              Volver al registro
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VerifyEmail;