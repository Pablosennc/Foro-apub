import { useState } from "react";
import styles from "../Forum.module.css";
import { Trash2, Send } from "lucide-react";

function CommentSection({ postId, comments, currentUser, onCreateComment, onDeleteComment }) {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    onCreateComment(postId, commentText);
    setCommentText(""); 
  };

  return (
    <div className={styles.commentsSection}>
      {comments && comments.map(comment => (
        <div key={comment.id} className={styles.commentItem}>
          <div className={styles.commentHeader}>
            <span className={styles.authorName} style={{ fontSize: "0.85rem" }}>
              {comment.profiles?.nombre} {comment.profiles?.apellido}
            </span>
            <span className={styles.dotSeparator} style={{ fontSize: "0.85rem" }}>•</span>
            
            {/* Botón eliminar al lado del nombre, discreto */}
            {currentUser?.id === comment.user_id && (
              <button onClick={() => onDeleteComment(comment.id)} className={styles.btnGhostDanger} style={{ padding: 0 }}>
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <p className={styles.commentContent}>{comment.content}</p>
        </div>
      ))}
      
      <div className={styles.commentInputGroup}>
        <input 
          type="text" 
          placeholder="Añadir una respuesta..." 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className={styles.input}
          style={{ flex: 1, padding: "0.6rem 0.8rem", borderRadius: "20px" }}
          onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()} 
        />
        <button onClick={handleCommentSubmit} className={styles.btnPrimary} style={{ borderRadius: "20px", padding: "0.6rem 1rem" }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export default CommentSection;