import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { getPosts, createPost, deletePost, createComment, deleteComment, toggleLike } from "../../services/postService"; 

function Forum() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dateDesc"); // dateDesc, dateAsc, likesDesc
  const [commentInputs, setCommentInputs] = useState({}); 

  useEffect(() => {
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

  const handleToggleLike = async (postId, hasLiked) => {
    if (!currentUser) return;
    try {
      // Optimización UX: podríamos actualizar el UI primero (Optimistic UI), pero por ahora refetch es más seguro
      await toggleLike(postId, currentUser.id, hasLiked);
      loadPosts();
    } catch (error) {
      alert("Error al procesar el like.");
    }
  };

  const handleCreateComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    try {
      await createComment(postId, text);
      setCommentInputs({ ...commentInputs, [postId]: "" }); 
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

  // ----------------------------------------------------
  // ESTADO DERIVADO: Filtro + Ordenamiento
  // ----------------------------------------------------
  let processedPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortBy === "dateDesc") {
    processedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortBy === "dateAsc") {
    processedPosts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (sortBy === "likesDesc") {
    processedPosts.sort((a, b) => (b.post_likes?.length || 0) - (a.post_likes?.length || 0));
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>Comunidad Foro APUB</h2>
        <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", backgroundColor: "var(--text-muted)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Cerrar Sesión
        </button>
      </header>

      {/* Controles: Buscador y Ordenamiento */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <input 
          type="text" 
          placeholder="🔍 Filtrar publicaciones..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 2, padding: "0.8rem", border: "1px solid var(--border-color)", borderRadius: "8px", fontSize: "1rem" }}
        />
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ flex: 1, padding: "0.8rem", border: "1px solid var(--border-color)", borderRadius: "8px", fontSize: "1rem", backgroundColor: "white", cursor: "pointer" }}
        >
          <option value="dateDesc">Más recientes</option>
          <option value="dateAsc">Más antiguos</option>
          <option value="likesDesc">Más populares (Likes)</option>
        </select>
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
        <h3>{searchTerm ? "Resultados de búsqueda" : "Publicaciones"}</h3>
        {processedPosts.length === 0 ? (
          <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>No se encontraron publicaciones.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
            {processedPosts.map((post) => {
              
              // Verificamos si el usuario actual le dio like a este post específico
              const hasLiked = post.post_likes?.some(like => like.user_id === currentUser?.id);
              const likesCount = post.post_likes?.length || 0;

              return (
                <div key={post.id} style={{ backgroundColor: "var(--card-bg)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border-color)", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h4 style={{ color: "var(--accent-color)", marginBottom: "0.5rem", fontSize: "1.2rem", marginTop: 0 }}>{post.title}</h4>
                    {currentUser?.id === post.user_id && (
                      <button onClick={() => handleDeletePost(post.id)} style={{ background: "none", border: "none", color: "#dc3545", cursor: "pointer", fontSize: "0.9rem", fontWeight: "bold" }}>Eliminar</button>
                    )}
                  </div>

                  <p style={{ color: "var(--text-main)", whiteSpace: "pre-wrap", marginTop: "0.5rem", lineHeight: "1.5" }}>{post.content}</p>
                  
                  {/* Fila de Metadatos y Botón de Like */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
                    <small style={{ color: "var(--text-muted)" }}>
                      Por: <strong>{post.profiles?.nombre} {post.profiles?.apellido}</strong> | {new Date(post.created_at).toLocaleDateString()}
                    </small>
                    
                    <button 
                      onClick={() => handleToggleLike(post.id, hasLiked)}
                      style={{ background: hasLiked ? "var(--accent-color)" : "transparent", color: hasLiked ? "white" : "var(--text-main)", border: `1px solid ${hasLiked ? "var(--accent-color)" : "var(--border-color)"}`, borderRadius: "20px", padding: "0.3rem 0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", transition: "all 0.2s" }}
                    >
                      {hasLiked ? "❤️" : "🤍"} {likesCount}
                    </button>
                  </div>

                  {/* Sección de Comentarios */}
                  <div style={{ marginTop: "1.5rem", paddingLeft: "1rem", borderLeft: "3px solid var(--accent-color)" }}>
                    {post.comments && post.comments.map(comment => (
                      <div key={comment.id} style={{ marginBottom: "1rem", backgroundColor: "#fdfdfc", padding: "0.8rem", borderRadius: "6px" }}>
                        <p style={{ margin: "0 0 0.4rem 0", fontSize: "0.95rem", color: "var(--text-main)" }}>{comment.content}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{comment.profiles?.nombre} {comment.profiles?.apellido}</small>
                          {currentUser?.id === comment.user_id && (
                            <button onClick={() => handleDeleteComment(comment.id)} style={{ background: "none", border: "none", color: "#dc3545", cursor: "pointer", fontSize: "0.8rem", padding: 0 }}>Eliminar</button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                      <input 
                        type="text" 
                        placeholder="Escribe un comentario..." 
                        value={commentInputs[post.id] || ""}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        style={{ flex: 1, padding: "0.6rem", border: "1px solid var(--border-color)", borderRadius: "4px", backgroundColor: "#FAFAF8" }}
                      />
                      <button onClick={() => handleCreateComment(post.id)} style={{ padding: "0.6rem 1rem", backgroundColor: "var(--text-main)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "500" }}>
                        Enviar
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Forum;