import styles from "../Forum.module.css";
import CommentSection from "./CommentSection";
import { Trash2, Heart, EyeOff, Eye } from "lucide-react"; // Agregamos los íconos del ojo

function PostCard({ 
  post, 
  currentUser, 
  currentUserRole, 
  onDeletePost, 
  onToggleLike, 
  onCreateComment, 
  onDeleteComment, 
  onToggleHidePost 
}) {
  const hasLiked = post.post_likes?.some(like => like.user_id === currentUser?.id);
  const likesCount = post.post_likes?.length || 0;

  const authorInitial = post.profiles?.nombre ? post.profiles.nombre.charAt(0).toUpperCase() : "?";

  return (
    // Reducimos la opacidad si el post está oculto
    <div 
      className={styles.card} 
      style={{ 
        marginBottom: "0", 
        opacity: post.oculto ? 0.45 : 1, 
        filter: post.oculto ? "blur(0.2px) grayscale(50%)" : "none",
        transition: "all 0.3s ease"
      }}
    >
      
      {/* 1. Fila Superior: Meta-datos (izq) y Botones de Acción (der) */}
      <div className={styles.postMetaTop} style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
        
        {/* Agrupamos Avatar e Info para que queden juntos a la izquierda */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div className={styles.avatar}>{authorInitial}</div>
          <div className={styles.authorInfo}>
            
            {/* Contenedor flexible para alinear el nombre y la insignia horizontalmente */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className={styles.authorName}>{post.profiles?.nombre} {post.profiles?.apellido}</span>
              
              {/* Renderizado condicional de la insignia */}
              {post.profiles?.rol === 'ccee' && (
                <span className={styles.cceeBadge}>CCEE</span>
              )}
            </div>

            <span className={styles.postDate}>
              {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Botones de acción derecha (Ocultar / Eliminar) */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          
          {/* Botón exclusivo del CCEE para ocultar/desocultar */}
          {currentUserRole === 'ccee' && (
            <button 
              onClick={() => onToggleHidePost(post.id, post.oculto)} 
              className={styles.btnGhostDanger} 
              title={post.oculto ? "Desocultar publicación" : "Ocultar publicación"}
              style={{ padding: "0.2rem", color: post.oculto ? "#6b7280" : "#9ca3af" }} 
            >
              {post.oculto ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          )}

          {/* Botón Eliminar Original (Solo visible para el creador del post) */}
          {currentUser?.id === post.user_id && (
            <button 
              onClick={() => onDeletePost(post.id)} 
              className={styles.btnGhostDanger} 
              title="Eliminar publicación permanentemente"
              style={{ padding: "0.2rem" }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Título */}
      <div className={styles.postHeader} style={{ marginBottom: "0.5rem" }}>
        <h4 className={styles.postTitle}>{post.title}</h4>
      </div>

      {/* 3. Contenido */}
      <p className={styles.postContent}>{post.content}</p>
      
      {/* 4. Barra de acciones (Likes) */}
      <div className={styles.postActions}>
        <button 
          onClick={() => onToggleLike(post.id, hasLiked)}
          className={`${styles.likeBtn} ${hasLiked ? styles.active : ""}`}
        >
          <Heart size={18} fill={hasLiked ? "currentColor" : "none"} /> 
          <span>{likesCount}</span>
        </button>
      </div>

      {/* 5. Comentarios */}
      <CommentSection 
        postId={post.id}
        comments={post.comments}
        currentUser={currentUser}
        onCreateComment={onCreateComment}
        onDeleteComment={onDeleteComment}
      />
    </div>
  );
}

export default PostCard;