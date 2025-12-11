import { useQuery } from "@tanstack/react-query";
import { posts } from "../lib/db/schema";
import { api } from "@/api";

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
	const { data: comments, isLoading } = useQuery({
		queryKey: ["comments"],
		queryFn: async () => {
			const { data, error } = await api.comments.get();
			if (error) throw new Error(String(error.status));
			return data;
		},
	});

	return (
		<div>
			<p>{post.title}</p>
			<p>{post.name}</p>
			<p>{post.createdAt.toLocaleDateString()}</p>
			<p>{post.description}</p>
			<p>{post.likes}</p>
			<p>{post.comments}</p>
		</div>
	);
}
