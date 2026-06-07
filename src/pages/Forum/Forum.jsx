import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { getPosts, createPost, deletePost, createComment, deleteComment } from "../../services/postService" 

function Forum() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // Nuevos estados para filtros y comentarios
  const [searchTerm, setSearchTerm] = useState("");
  const [commentInputs, setCommentInputs] = useState({}); // Guarda el texto del comentario para cada post

  useEffect(() => {
    // Obtener el usuario actual para saber qué posts puede borrar
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      alert("No se pudieron cargar las publicaciones.");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      await createPost(title, content);
      setTitle("");
      setContent("");
      loadPosts();
    } catch (error) {
      alert("Hubo un error al publicar.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return;
    try {
      await deletePost(postId);
      loadPosts();
    } catch (error) {
      alert("No se pudo eliminar la publicación.");
    }
  };

  const handleCreateComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    try {
      await createComment(postId, text);
      setCommentInputs({ ...commentInputs, [postId]: "" }); // Limpiar el input
      loadPosts();
    } catch (error) {
      alert("No se pudo enviar el comentario.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("¿Seguro que quieres eliminar tu comentario?")) return;
    try {
      await deleteComment(commentId);
      loadPosts();
    } catch (error) {
      alert("No se pudo eliminar el comentario.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Lógica del filtro de búsqueda
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>Comunidad Foro APUB</h2>
        <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", backgroundColor: "var(--text-muted)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Cerrar Sesión
        </button>
      </header>

      {/* Buscador */}
      <div style={{ marginBottom: "2rem" }}>
        <input 
          type="text" 
          placeholder="🔍 Filtrar publicaciones por título o contenido..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "0.8rem", border: "1px solid var(--border-color)", borderRadius: "8px", fontSize: "1rem" }}
        />
      </div>

      <div style={{ backgroundColor: "var(--card-bg)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border-color)", marginBottom: "2rem" }}>
        <h3>Crear un nuevo hilo</h3>
        <form onSubmit={handleCreatePost} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          <input type="text" placeholder="Título de la publicación" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: "0.8rem", border: "1px solid var(--border-color)", borderRadius: "4px" }} />
          <textarea placeholder="¿Qué estás pensando?" value={content} onChange={(e) => setContent(e.target.value)} rows="3" required style={{ padding: "0.8rem", border: "1px solid var(--border-color)", borderRadius: "4px", resize: "vertical" }} />
          <button type="submit" style={{ padding: "0.8rem", backgroundColor: "var(--accent-color)", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>Publicar</button>
        </form>
      </div>

      <div>
        <h3>{searchTerm ? "Resultados de búsqueda" : "Últimos hilos"}</h3>
        {filteredPosts.length === 0 ? (
          <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>No se encontraron publicaciones.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            {filteredPosts.map((post) => (
              <div key={post.id} style={{ backgroundColor: "var(--card-bg)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                
                {/* Cabecera del Post con Botón de Eliminar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h4 style={{ color: "var(--accent-color)", marginBottom: "0.5rem", fontSize: "1.2rem", marginTop: 0 }}>{post.title}</h4>
                  {currentUser?.id === post.user_id && (
                    <button onClick={() => handleDeletePost(post.id)} style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: "0.9rem" }}>🗑️ Eliminar</button>
                  )}
                </div>

                <p style={{ color: "var(--text-main)", whiteSpace: "pre-wrap", marginTop: "0.5rem" }}>{post.content}</p>
                <small style={{ color: "var(--text-muted)", display: "block", marginTop: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
                  Por: <strong>{post.profiles?.nombre} {post.profiles?.apellido}</strong> | Publicado el {new Date(post.created_at).toLocaleDateString()}
                </small>

                {/* Sección de Comentarios */}
                <div style={{ marginTop: "1rem", paddingLeft: "1rem", borderLeft: "3px solid var(--border-color)" }}>
                  {post.comments && post.comments.map(comment => (
                    <div key={comment.id} style={{ marginBottom: "0.8rem" }}>
                      <p style={{ margin: "0 0 0.2rem 0", fontSize: "0.95rem" }}>{comment.content}</p>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <small style={{ color: "var(--text-muted)" }}>- {comment.profiles?.nombre} {comment.profiles?.apellido}</small>
                        {currentUser?.id === comment.user_id && (
                          <button onClick={() => handleDeleteComment(comment.id)} style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: "0.8rem", padding: 0 }}>Eliminar</button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Input para nuevo comentario */}
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <input 
                      type="text" 
                      placeholder="Escribe un comentario..." 
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      style={{ flex: 1, padding: "0.5rem", border: "1px solid var(--border-color)", borderRadius: "4px" }}
                    />
                    <button onClick={() => handleCreateComment(post.id)} style={{ padding: "0.5rem 1rem", backgroundColor: "var(--text-muted)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Comentar
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Forum;