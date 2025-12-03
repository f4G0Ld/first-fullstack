import { db } from "@/src/lib/db/database";
import { posts } from "@/src/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";

export const postsRoutes = new Elysia({
	name: "postsRoutes",
	prefix: "/posts",
})

	.get("/", async () => {
		return await db.select().from(posts);
	})

	.post(
		"/",
		async ({ body }) => {
			const [newPost] = await db.insert(posts).values(body).returning();
			return newPost;
		},
		{
			body: t.Object({
				title: t.String(),
				name: t.String(),
				description: t.String(),
			}),
		},
	)

	.post(
		"/:postId/like",
		async ({ params }) => {
			const [updatedPost] = await db
				.update(posts)
				.set({ likes: sql`${posts.likes} + 1` })
				.where(eq(posts.id, params.postId))
				.returning();

			return updatedPost;
		},
		{
			params: t.Object({
				postId: t.String(),
			}),
		},
	);
