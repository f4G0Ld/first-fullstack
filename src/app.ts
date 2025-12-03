import Elysia from "elysia";
import { postsRoutes } from "./routes/posts";
import { commentsRoutes } from "./routes/comments";

const app = new Elysia({
	name: "app",
	prefix: "/api",
})

	.use(postsRoutes)
	.use(commentsRoutes)

	.listen(3000);
