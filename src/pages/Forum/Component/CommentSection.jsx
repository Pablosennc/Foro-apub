import { useState } from "react";
import styles from "../Forum.module.css";
import { Trash2, Send, User } from "lucide-react";
function CommentSection({ postId, comments, currentUser, onCreateComment, onDeleteComment }) {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    onCreateComment(postId, commentText);
    setCommentText(""); 
  };

  const hasText = commentText.trim().length > 0;

  return (
    <div className={styles.commentsSection}>
      {comments && comments.map(comment => {
        const commentInitial = comment.profiles?.nombre ? comment.profiles.nombre.charAt(0).toUpperCase() : "?";

        return (
          <div key={comment.id} className={styles.commentItem}>
            <div className={styles.commentAvatar}>{commentInitial}</div>
            
            <div className={styles.commentBubble}>
              <div className={styles.commentHeader}>
                {/* Agrupamos nombre e insignia horizontalmente */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span className={styles.authorName} style={{ fontSize: "0.85rem" }}>
                    {comment.profiles?.nombre} {comment.profiles?.apellido}
                  </span>

                  {/* Renderizado condicional de la insignia para el comentario */}
                  {comment.profiles?.rol === 'ccee' && (
                    <span className={styles.cceeBadge} style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem", letterSpacing: "1.2px"
                      
                     }}>
                      CCEE
                    </span>
                  )}
                </div>
                
                {currentUser?.id === comment.user_id && (
                  <button onClick={() => onDeleteComment(comment.id)} className={styles.btnGhostDanger} style={{ padding: 0 }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <p className={styles.commentContent}>{comment.content}</p>
            </div>
          </div>
        );
      })}
      
      {/* Input para responder - Geometría Perfecta */}
      <div className={styles.commentInputGroup} style={{ alignItems: "center", marginTop: "1.2rem" }}>
        
        {/* Avatar neutral: 38x38 */}
        <div 
          className={styles.commentAvatar} 
          style={{ width: "38px", height: "38px", backgroundColor: "#f3f4f6", color: "#9ca3af" }}
        >
          <User size={18} />
        </div>
        
        <input 
          type="text" 
          placeholder="Escribe una respuesta..." 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className={styles.input}
          style={{ 
            flex: 1, 
            height: "38px", /* Altura estricta para igualar al botón y avatar */
            padding: "0 1.2rem", /* Solo padding lateral, la altura la da el height */
            borderRadius: "20px", 
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
            margin: 0,
            boxSizing: "border-box" /* Evita que el borde sume píxeles extra */
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()} 
        />
        
        {/* Botón circular: 38x38 */}
        <button 
          onClick={handleCommentSubmit} 
          disabled={!hasText}
          style={{ 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "38px",
            height: "38px",
            borderRadius: "50%", 
            backgroundColor: hasText ? "var(--accent-color)" : "#e5e7eb", 
            color: hasText ? "white" : "#9ca3af",
            border: "none", 
            cursor: hasText ? "pointer" : "default",
            transition: "all 0.2s ease",
            padding: 0,
            flexShrink: 0
          }}
        >
          <Send size={16} style={{ marginLeft: hasText ? "-2px" : "0" }} />
        </button>
      </div>
    </div>
  );
}

export default CommentSection;