"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePosts, Post } from "@/lib/usePosts";

export default function CommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { posts, loading: postsLoading, createPost } = usePosts();
  const [showModal, setShowModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user) return;

    setPosting(true);
    const userName = user.email?.split("@")[0] || "User";
    const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
    const avatar = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;

    try {
      await createPost(user.uid, formattedName, user.email || "", newPostContent, avatar);
      setNewPostContent("");
      setShowModal(false);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setPosting(false);
    }
  };

  if (authLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatTime = (createdAt: any): string => {
    if (!createdAt) return "Just now";
    
    let date: Date;
    if (typeof createdAt === 'object' && createdAt.toDate) {
      date = createdAt.toDate();
    } else {
      date = new Date(createdAt);
    }
    
    if (isNaN(date.getTime())) return "Just now";
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <header className="w-full bg-[#2E4057] text-white px-6 py-3 flex items-center justify-between">
        <span className="text-xl font-semibold text-[#FF6B35]">TravelLoop</span>
        <div className="w-8 h-8 rounded-full bg-gray-400 overflow-hidden">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search bar ......"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] bg-white text-black"
          />
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
            Group by
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
            Filter
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
            Sort by...
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-center text-black mb-6">
          Community tab
        </h2>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No posts yet. Be the first to share your travel experience!
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                  <img
                    src={post.avatar}
                    alt={post.userName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 bg-white rounded-3xl border border-gray-300 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#2E4057]">{post.userName}</span>
                    <span className="text-sm text-gray-500">{formatTime(post.createdAt)}</span>
                  </div>
                  <p className="text-gray-600">{post.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button 
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#FF6B35] hover:bg-[#e55a2b] text-white text-2xl font-bold rounded-full shadow-lg flex items-center justify-center transition"
      >
        +
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold text-[#2E4057] mb-4">Create Post</h3>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your travel experience..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] resize-none h-32"
            />
            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                disabled={posting}
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={posting || !newPostContent.trim()}
                className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] disabled:opacity-50"
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}