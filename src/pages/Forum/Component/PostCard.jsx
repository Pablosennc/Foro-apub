import styles from "../Forum.module.css";
import CommentSection from "./CommentSection";

function PostCard({ post, currentUser, onDeletePost, onToggleLike, onCreateComment, onDeleteComment }) {
  
  const hasLiked = post.post_likes?.some(like => like.user_id === currentUser?.id);
  const likesCount = post.post_likes?.length || 0;

  return (
    <div className={styles.card} style={{ marginBottom: "0" }}>
      
      {/* Cabecera */}
      <div className={styles.postHeader}>
        <h4 className={styles.postTitle}>{post.title}</h4>
        {currentUser?.id === post.user_id && (
          <button onClick={() => onDeletePost(post.id)} className={styles.btnDanger}>🗑️ Eliminar</button>
        )}
      </div>

      {/* Contenido */}
      <p className={styles.postContent}>{post.content}</p>
      
      {/* Metadatos y Likes */}
      <div className={styles.postMeta}>
        <small style={{ color: "var(--text-muted)" }}>
          Por: <strong>{post.profiles?.nombre} {post.profiles?.apellido}</strong> | {new Date(post.created_at).toLocaleDateString()}
        </small>
        
        <button 
          onClick={() => onToggleLike(post.id, hasLiked)}
          className={styles.likeBtn}
          style={{ 
            background: hasLiked ? "var(--accent-color)" : "transparent", 
            color: hasLiked ? "white" : "var(--text-main)", 
            border: `1px solid ${hasLiked ? "var(--accent-color)" : "var(--border-color)"}` 
          }}
        >
          {hasLiked ? "❤️" : "🤍"} {likesCount}
        </button>
      </div>

      {/* Delegamos toda la lógica de comentarios al nuevo componente */}
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