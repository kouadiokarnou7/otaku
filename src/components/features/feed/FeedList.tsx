
"use client";

import type { Post, UserProfile } from "@/lib/types";

import PostCard from "@/components/features/feed/PostCard";

interface FeedListProps {
  posts: Post[];
  currentUser: UserProfile;
  onLike?: (postId: string) => void;
  emptyMessage?: string;
}

export default function FeedList({ 
  posts, 
  currentUser, 
  onLike,
  emptyMessage = "Aucun post pour le moment 🎮" 
}: FeedListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-800">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          onLike={onLike} 
        />
      ))}
    </div>
  );
}