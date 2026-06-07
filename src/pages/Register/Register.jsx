import { useState } from "react";
import styles from "./Register.module.css"; 
// 1. Importar el cliente de Supabase
import { supabase } from "../../supabaseClient"; 

function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState(""); // Para mostrar éxito

  // 2. Hacer la función asíncrona
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); 
    setMensaje("");

    if (!nombre || !apellido || !email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const regexCorreoUCT = /^[a-zA-Z0-9._%+-]+@alu\.uct\.cl$/;
    if (!regexCorreoUCT.test(email)) {
      setError("Debes usar un correo institucional válido (@alu.uct.cl).");
      return;
    }

    // 3. Llamar a Supabase para registrar al usuario
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          nombre: nombre,
          apellido: apellido,
        }
      }
    });

    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      setMensaje("¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.");
      // Opcional: limpiar los campos
      setNombre("");
      setApellido("");
      setEmail("");
      setPassword("");
    }
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

            {error && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "-10px" }}>{error}</p>}
            {mensaje && <p style={{ color: "green", fontSize: "0.85rem", marginTop: "-10px" }}>{mensaje}</p>}

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