"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { api } from "@/src/lib/api";
import { useState } from "react";
import {
  Calendar,
  Heart,
  MessageCircle,
  Trash2,
  User,
  UserCircle,
} from "lucide-react";
import { queryClient } from "../app/query-client";

type Post = {
  id: string;
  title: string;
  name: string;
  imageId: string;
  description: string;
  likes: number | null;
  comments: number | null;
  createdAt: Date;
};

type Comment = {
  id: string;
  name: string;
  text: string;
  postId: string;
  createdAt: Date;
};

export function PostCard({ post }: { post: Post }) {
  const [showComments, setShowComments] = useState(false);

  const formatDate = new Date(post.createdAt).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: async () => {
      const { data, error } = await api.comments.get({
        query: { postId: post.id },
      });
      if (error) throw new Error(String(error.status));
      return data;
    },
    enabled: showComments,
  });

  const likeMutation = useMutation({
    mutationFn: () => api.posts({ id: post.id }).like.put(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Like error:", error);
      alert("Не удалось поставить лайк");
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const deleteMutation = useMutation({
    mutationFn: () => api.posts({ id: post.id }).delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Delete error:", error);
      alert("Не удалось удалить пост");
    },
  });

  const handleDelete = () => {
    if (confirm("Удалить пост?")) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow max-w-4xl mx-auto w-full">
      {post.imageId && (
        <Image
          src={`/api/files/${post.imageId}`}
          className="w-full aspect-[4/1] object-cover"
          width={1280}
          height={720}
          alt={post.title}
        />
      )}
      <div className="flex flex-col gap-5 p-6 text-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center">
            <UserCircle className="text-[#155DFC]" />
          </div>
          <div className="text-[12px] text-[#4A5565]">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3" />
              <span>{post.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{formatDate}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="flex-1 text-[20px] font-semibold">
              {post.title}
            </span>
            <button
              type="button"
              className="cursor-pointer"
              title="Delete post"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-4 h-4 text-[#99A1AF] hover:text-red-500 transition-colors" />
            </button>
          </div>
          <div>
            <span className="text-[#4A5565] whitespace-pre-line">
              {post.description}
            </span>
          </div>
        </div>
        <hr className="text-[#4A5565]" />
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="flex gap-1 hover:text-[#FF0000] transition-colors items-center cursor-pointer"
            title="Like"
            onClick={handleLike}
            disabled={likeMutation.isPending}
          >
            <Heart className="w-4 h-4" />
            <span>{post.likes || 0}</span>
          </button>
          <button
            type="button"
            className="flex gap-1 hover:text-[#155DFC] transition-colors items-center cursor-pointer"
            title="Comment"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
