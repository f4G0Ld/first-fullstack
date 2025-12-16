import Elysia from "elysia";
import { postsRoutes } from "./routes/posts";
import { commentsRoutes } from "./routes/comments";
import { filesRoutes } from "./routes/files";

export const app = new Elysia({
  name: "app",
  prefix: "/api",
})
  .use(postsRoutes)
  .use(commentsRoutes)
  .use(filesRoutes);
