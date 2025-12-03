import { Plus, SquarePen } from "lucide-react";

export default function Header() {
	return (
		<div className="bg-white w-full border-b border-[#C0C0C0]">
			<div className="justify-between max-w-4xl mx-auto px-4 py-6">
				<div className="flex items-center justify-between text-[14px]">
					<div className="flex gap-3 items-center">
						<SquarePen className="w-8 h-8 text-[#155DFC]" />
						<p>DevBlog</p>
					</div>
					<button
						type="button"
						className="flex items-center px-3.5 py-1.75 gap-2 bg-[#155DFC] rounded-lg text-white"
					>
						<Plus className="w-4 h-4" />
						<p>Create Post</p>
					</button>
				</div>
			</div>
		</div>
	);
}
