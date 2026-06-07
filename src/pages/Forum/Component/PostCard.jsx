import styles from "../Forum.module.css";
import CommentSection from "./CommentSection";
import { Trash2, Heart } from "lucide-react"; // Importamos los íconos limpios

function PostCard({ post, currentUser, onDeletePost, onToggleLike, onCreateComment, onDeleteComment }) {
  const hasLiked = post.post_likes?.some(like => like.user_id === currentUser?.id);
  const likesCount = post.post_likes?.length || 0;

  return (
    <div className={styles.card} style={{ marginBottom: "0" }}>
      
      {/* Cabecera con Título y Botón Eliminar alineados */}
      <div className={styles.postHeader}>
        <h4 className={styles.postTitle}>{post.title}</h4>
        {currentUser?.id === post.user_id && (
          <button onClick={() => onDeletePost(post.id)} className={styles.btnGhostDanger} title="Eliminar publicación">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Metadatos contextuales bajo el título */}
      <div className={styles.postMetaTop}>
        <span className={styles.authorName}>{post.profiles?.nombre} {post.profiles?.apellido}</span>
        <span className={styles.dotSeparator}>•</span>
        <span>{new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
      </div>

      {/* Contenido legible */}
      <p className={styles.postContent}>{post.content}</p>
      
      {/* Barra de acciones (Likes) */}
      <div className={styles.postActions}>
        <button 
          onClick={() => onToggleLike(post.id, hasLiked)}
          className={`${styles.likeBtn} ${hasLiked ? styles.active : ""}`}
        >
          <Heart size={16} fill={hasLiked ? "currentColor" : "none"} /> 
          <span>{likesCount}</span>
        </button>
      </div>

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