import { supabase } from './supabaseClient';

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
      )
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