
import { useState } from "react";
import styles from "../Forum.module.css";

function CommentSection({ postId, comments, currentUser, onCreateComment, onDeleteComment }) {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    onCreateComment(postId, commentText);
    setCommentText(""); // Limpiamos el input después de enviar
  };

  return (
    <div className={styles.commentsSection}>
      {comments && comments.map(comment => (
        <div key={comment.id} className={styles.commentItem}>
          <p className={styles.commentContent}>{comment.content}</p>
          <div className={styles.commentFooter}>
            <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
              {comment.profiles?.nombre} {comment.profiles?.apellido}
            </small>
            {currentUser?.id === comment.user_id && (
              <button 
                onClick={() => onDeleteComment(comment.id)} 
                className={styles.btnDanger} 
                style={{ fontSize: "0.8rem" }}
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      ))}
      
      {/* Input de Comentario */}
      <div className={styles.commentInputGroup}>
        <input 
          type="text" 
          placeholder="Escribe una respuesta..." 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className={styles.input}
          style={{ flex: 1, backgroundColor: "#FAFAF8" }}
          onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()} // Permite enviar con Enter
        />
        <button onClick={handleCommentSubmit} className={styles.btnSecondary}>
          Responder
        </button>
      </div>
    </div>
  );
}

export default CommentSection;