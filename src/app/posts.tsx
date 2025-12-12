"use client";

import { useQuery } from "@tanstack/react-query";
import { posts } from "../lib/db/schema";
import { api } from "@/api";
import { useState } from "react";
import {
	Calendar,
	Heart,
	MessageCircle,
	Trash2,
	User,
	UserCircle,
} from "lucide-react";

type post = {
	id: string;
	title: string;
	name: string;
	description: string;
	likes: number | null;
	comments: number | null;
	createdAt: Date;
};

export function PostCard({ post }: { post: post }) {
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

	const handleLike = async () => {
		try {
			await api.posts({ id: post.id }).like.put();
		} catch (error) {
			console.error("Like error: ", error);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow container">
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
				<div className="flex flex-col gap-3">
					<div className="flex justify-between items-center">
						<span className="flex-1 text-[20px] font-semibold">
							{post.title}
						</span>
						<button title="Delete post">
							<Trash2 className="w-4 h-4 text-[#99A1AF] hover:text-red-500 transition-colors" />
						</button>
					</div>
					<div>
						<span className="text-[#4A5565]">{post.description}</span>
					</div>
				</div>
				<hr className="text-[#4A5565]" />
				<div>
					<button>
						<Heart className="w-4 h-4 hover:text-red-500 transition-colors" />
					</button>
					<button>
						<MessageCircle className="w-4 h-4 hover:text-[#155DFC] transition-colors" />
					</button>
				</div>
			</div>
		</div>
	);
}
