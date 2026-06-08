import styles from "../Forum.module.css";
import CommentSection from "./CommentSection";
import { Trash2, Heart } from "lucide-react"; // Importamos los íconos limpios

function PostCard({ post, currentUser, onDeletePost, onToggleLike, onCreateComment, onDeleteComment }) {
  const hasLiked = post.post_likes?.some(like => like.user_id === currentUser?.id);
  const likesCount = post.post_likes?.length || 0;

  const authorInitial = post.profiles?.nombre ? post.profiles.nombre.charAt(0).toUpperCase() : "?";

  return (
    <div className={styles.card} style={{ marginBottom: "0" }}>
      
      {/* 1. Fila Superior: Meta-datos (izq) y Botón Eliminar (der) */}
      <div className={styles.postMetaTop} style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
        
        {/* Agrupamos Avatar e Info para que queden juntos a la izquierda */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div className={styles.avatar}>{authorInitial}</div>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{post.profiles?.nombre} {post.profiles?.apellido}</span>
            <span className={styles.postDate}>
              {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Botón Eliminar reubicado arriba a la derecha */}
        {currentUser?.id === post.user_id && (
          <button 
            onClick={() => onDeletePost(post.id)} 
            className={styles.btnGhostDanger} 
            title="Eliminar publicación"
            style={{ padding: "0.2rem" }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* 2. Título (ahora libre de botones) */}
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