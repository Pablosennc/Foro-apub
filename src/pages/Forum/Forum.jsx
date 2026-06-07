import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { getPosts, createPost, deletePost, createComment, deleteComment, toggleLike } from "../../services/postService"; 
import styles from "./Forum.module.css";

// Importamos los nuevos componentes
import CreatePostForm from "./Component/CreatePostForm";
import PostCard from "./Component/PostCard";

function Forum() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dateDesc"); 

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

  // --- Funciones orquestadoras (se pasan a los componentes como props) ---
  const handleCreatePost = async (title, content) => {
    try { await createPost(title, content); loadPosts(); } 
    catch (err) { alert("Error al publicar."); }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return;
    try { await deletePost(postId); loadPosts(); } 
    catch (err) { alert("Error al eliminar."); }
  };

  const handleToggleLike = async (postId, hasLiked) => {
    if (!currentUser) return;
    try { await toggleLike(postId, currentUser.id, hasLiked); loadPosts(); } 
    catch (err) { alert("Error al procesar el like."); }
  };

  const handleCreateComment = async (postId, text) => {
    try { await createComment(postId, text); loadPosts(); } 
    catch (err) { alert("Error al enviar el comentario."); }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("¿Seguro que quieres eliminar tu comentario?")) return;
    try { await deleteComment(commentId); loadPosts(); } 
    catch (err) { alert("Error al eliminar comentario."); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // --- Estado Derivado (Filtros y Orden) ---
  let processedPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortBy === "dateDesc") processedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  else if (sortBy === "dateAsc") processedPosts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  else if (sortBy === "likesDesc") processedPosts.sort((a, b) => (b.post_likes?.length || 0) - (a.post_likes?.length || 0));

  // --- Renderizado Visual ---
  // --- Renderizado Visual ---
  return (
    <div className={styles.container}>
      
      <header className={styles.header}>
        <h2 className={styles.title}>Comunidad Foro APUB</h2>
        <button onClick={handleLogout} className={styles.btnSecondary}>Cerrar Sesión</button>
      </header>

      {/* Aquí aplicamos el Grid Layout */}
      <div className={styles.forumGrid}>
        
        {/* COLUMNA IZQUIERDA: Buscador y Lista de Posts */}
        <main className={styles.mainContent}>
          
          <div className={styles.controls}>
            <input 
              type="text" 
              placeholder="🔍 Buscar publicaciones..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.inputSearch}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.selectFilter}>
              <option value="dateDesc">Más recientes</option>
              <option value="dateAsc">Más antiguos</option>
              <option value="likesDesc">Más populares</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {processedPosts.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No se encontraron publicaciones.</p>
            ) : (
              processedPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  currentUser={currentUser}
                  onDeletePost={handleDeletePost}
                  onToggleLike={handleToggleLike}
                  onCreateComment={handleCreateComment}
                  onDeleteComment={handleDeleteComment}
                />
              ))
            )}
          </div>

        </main>

        {/* COLUMNA DERECHA: Sidebar para Crear Posts y Widgets */}
        <aside className={styles.sidebar}>
          <CreatePostForm onCreate={handleCreatePost} />
          
          {/* Aquí a futuro podemos agregar más cosas de UI, como: */}
          <div className={styles.card}>
            <h4 style={{ marginTop: 0, color: "var(--text-main)" }}>Reglas del Foro</h4>
            <ul style={{ fontSize: "0.9rem", color: "var(--text-muted)", paddingLeft: "1.2rem", margin: 0 }}>
              <li>Mantén el respeto en la comunidad.</li>
              <li>Busca antes de preguntar.</li>
              <li>Usa un título descriptivo.</li>
            </ul>
          </div>
        </aside>

      </div>
      
    </div>
  );
}

export default Forum;