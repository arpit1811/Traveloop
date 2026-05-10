import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  avatar: string;
  content: string;
  createdAt: string | null;
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createPost = async (userId: string, userName: string, userEmail: string, content: string, avatar: string) => {
    await addDoc(collection(db, "posts"), {
      userId,
      userName,
      userEmail,
      avatar,
      content,
      createdAt: serverTimestamp(),
    });
  };

  return { posts, loading, createPost };
}