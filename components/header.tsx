export default function Header() {
	return (
		<div className="flex justify-between container p-4">
			<div>
				<p>DevBlog</p>
			</div>
			<div className="flex gap-5">
				<a href="#">Home</a>
				<a href="#">About</a>
				<a href="#">Categories</a>
				<button>
					<p>Create Post</p>
				</button>
			</div>
		</div>
	);
}
