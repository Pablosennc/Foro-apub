import { supabase } from '../services/supabaseClient';

export const getPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      created_at,
      user_id,
      profiles (nombre, apellido),
      comments (
        id,
        content,
        created_at,
        user_id,
        profiles (nombre, apellido)
      ),
      post_likes (user_id)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error; 
  return data;
};

export const createPost = async (title, content) => {
  const { error } = await supabase.from("posts").insert([{ title, content }]);
  if (error) throw error;
};

export const deletePost = async (postId) => {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;
};

export const createComment = async (postId, content) => {
  const { error } = await supabase.from("comments").insert([{ post_id: postId, content }]);
  if (error) throw error;
};

export const deleteComment = async (commentId) => {
  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) throw error;
};

// NUEVA FUNCIÓN: Maneja dar o quitar like
export const toggleLike = async (postId, userId, hasLiked) => {
  if (hasLiked) {
    const { error } = await supabase.from("post_likes").delete().match({ post_id: postId, user_id: userId });
    if (error) throw error;
  } else {
    const { error } = await supabase.from("post_likes").insert([{ post_id: postId, user_id: userId }]);
    if (error) throw error;
  }
};