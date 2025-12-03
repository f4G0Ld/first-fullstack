import Elysia from "elysia";
import { postsRoutes } from "./routes/posts";

const app = new Elysia({
	name: "app",
	prefix: "/api",
})

    .use(postsRoutes)

    .listen(3000)