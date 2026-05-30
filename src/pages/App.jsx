import "../styles/App.css"
import { useState } from "react"

function App() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Usuario:", user, "Contraseña", password);
  }


  return (
    <>
    <header>
      <span>
        Foro APUB
      </span>
    </header>

    <main>
      <h1 className="Welcome_title">¡Bienvenido a Foro APUB!</h1>

      <h3 className="Welcome_subtitle">Donde tu opinión importa más que nunca</h3>

      <div className="Credenciales">
        
        <form className="Login" onSubmit={handleLogin}>
          <input type="text" placeholder="Usuario" className="Login_input" value={user} onChange={(e) => setUser(e.target.value)} />
          <br />
          <input type="password" placeholder="Contraseña" className="Login_input" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button type="submit" className="Login_button">Iniciar Sesión</button>
        </form>

        <section className="Forgot_password">
          <button className="Forgot_password_button">¿Olvidaste tu contraseña?</button>
        </section>

        
        <section className="Register_container"> 
          <button className="Register_button">Registrarse</button>
        </section>
      </div>

      


    </main>

    <footer>
        <p className="Llamada"> Recuerda seguirnos en instagram @apublicate.uct</p>
    </footer> 

      

      
    </>
  )
}

export default App