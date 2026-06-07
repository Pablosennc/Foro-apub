import { useState } from "react";
import styles from "../Forum.module.css";

function CreatePostForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    // Llamamos a la función del padre y limpiamos
    onCreate(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <div className={styles.card}>
      <h3>Crear un nuevo hilo</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="text" 
          placeholder="Título de la publicación (ej: Consulta sobre malla curricular)" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          className={styles.input} 
        />
        <textarea 
          placeholder="Describe tu consulta o reclamo..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          rows="3" 
          required 
          className={styles.textarea} 
        />
        <button type="submit" className={styles.btnPrimary}>Publicar en el Foro</button>
      </form>
    </div>
  );
}

export default CreatePostForm;