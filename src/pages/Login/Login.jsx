import { useState } from "react"
// Importamos los estilos como un módulo
import styles from "./Login.module.css"

function Login() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Correo:", mail, "Contraseña", password);
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span>Foro APUB UCT</span>
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
            <button type="submit" className={styles.buttonPrimary}>
              Iniciar Sesión
            </button>
          </form>

          <div className={styles.linksContainer}>
            <button className={styles.linkButton}>¿Olvidaste tu contraseña?</button>
            <div className={styles.divider}></div>
            <button className={styles.linkButton}>Registrarse</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login;