import { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

function Login() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // 2. Estados para feedback
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  // 3. Hacer la función asíncrona
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!mail || !password) {
      setError("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    // 4. Llamar a Supabase para iniciar sesión
    const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
      email: mail,
      password: password,
    });

    if (supabaseError) {
      setError("Credenciales incorrectas o usuario no registrado.");
      console.error(supabaseError);
    } else {
      setMensaje("¡Inicio de sesión exitoso!");
      navigate("/foro");
      console.log("Usuario logueado:", data.user);
      // Más adelante, aquí redirigiremos a la página principal del foro
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span>Foro APUB</span>
      </header>

      <main className={styles.container}>
        <h1 className={styles.title}>¡Bienvenido a Foro APUB!</h1>
        <h3 className={styles.subtitle}>Donde tu opinión importa más que nunca</h3>

        <div className={styles.card}>
          <form onSubmit={handleLogin} className={styles.formGroup}>
            <input 
              type="email" 
              placeholder="Correo Institucional (@alu.uct.cl)" 
              className={styles.input}
              value={mail}
              onChange={(e) => setMail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Mensajes de error o éxito */}
            {error && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "-10px" }}>{error}</p>}
            {mensaje && <p style={{ color: "green", fontSize: "0.85rem", marginTop: "-10px" }}>{mensaje}</p>}

            <button type="submit" className={styles.buttonPrimary}>
              Iniciar Sesión
            </button>
          </form>
          
          <div className={styles.linksContainer}>
            <button 
              type="button" /* type="button" evita que envíen el formulario */
              className={styles.linkButton} 
              onClick={() => navigate('/forgot-password')}
            >
              ¿Olvidaste tu contraseña?
            </button>
            <div className={styles.divider}></div>
            <button 
              type="button" 
              className={styles.linkButton} 
              onClick={() => navigate('/register')}
            >
              Registrarse
            </button>
          </div>
          
        </div>
      </main>
    </div>
  )
}

export default Login;