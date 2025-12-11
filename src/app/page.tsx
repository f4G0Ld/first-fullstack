"use client";
import { api } from "@/api";
import Header from "@/src/components/header";
import { useQuery } from "@tanstack/react-query";
import { PostCard } from "./posts";

export default function Main() {
	const { data: posts, isLoading } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const { data, error } = await api.posts.get();
			if (error) throw new Error(String(error.status));
			return data;
		},
	});

	
	

	return (
		<div className="flex flex-col items-center">
			<Header />
			{posts?.map((p) => (
				<PostCard key={p.id} post={p}/>
			))}
		</div>
	);
}
