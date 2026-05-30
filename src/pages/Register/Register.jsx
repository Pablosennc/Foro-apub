import { useState } from "react";
// Asumimos que creaste Register.module.css (puedes copiar los estilos de Login por ahora)
import styles from "./Register.module.css"; 

function Register() {
  // 1. Estados para los datos que mencionaste
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estado para manejar los mensajes de error
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setError(""); // Limpiamos errores previos

    // 2. Validación de campos vacíos
    if (!nombre || !apellido || !email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // 3. Validación de Correo Institucional con Regex
    const regexCorreoUCT = /^[a-zA-Z0-9._%+-]+@alu\.uct\.cl$/;
    
    if (!regexCorreoUCT.test(email)) {
      setError("Debes usar un correo institucional válido (@alu.uct.cl).");
      return;
    }

    // Si pasa todas las validaciones, aquí conectaremos con la base de datos
    console.log("Registrando usuario...");
    console.log({ nombre, apellido, email, password });
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span>Foro APUB</span>
      </header>

      <main className={styles.container}>
        <h1 className={styles.title}>Crea tu cuenta</h1>
        <h3 className={styles.subtitle}>Únete a la comunidad con tu correo institucional</h3>

        <div className={styles.card}>
          <form onSubmit={handleRegister} className={styles.formGroup}>
            
            <input 
              type="text" 
              placeholder="Nombre" 
              className={styles.input}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            
            <input 
              type="text" 
              placeholder="Apellido" 
              className={styles.input}
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />

            <input 
              type="email" 
              placeholder="Correo Institucional (@alu.uct.cl)" 
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <input 
              type="password" 
              placeholder="Contraseña" 
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Renderizado condicional del error: Si hay error, muéstralo */}
            {error && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "-10px" }}>{error}</p>}

            <button type="submit" className={styles.buttonPrimary}>
              Registrarse
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Register;