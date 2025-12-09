import Elysia from "elysia";
import { db } from "../lib/db/database";
import { comments, posts } from "../lib/db/schema";
import z from "zod/v4";
import { desc, eq, sql } from "drizzle-orm";

export const commentsRoutes = new Elysia({
	name: "commentRoutes",
	prefix: "/comments",
})

	.get("/", async () => {
		return await db.select().from(comments).orderBy(desc(comments.createdAt));
	})

	.get("/post/:id", async ({ params }) => {
		return await db
			.select()
			.from(comments)
			.where(eq(comments.postId, params.id))
			.orderBy(desc(comments.createdAt));
	})

	.post(
		"/",
		async ({ body }) => {
			const comment = await db.insert(comments).values(body).returning();

			await db
				.update(posts)
				.set({
					comments: sql`${posts.comments} + 1`,
				})
				.where(eq(posts.id, body.postId));

			return comment;
		},
		{
			body: z.object({
				name: z.string(),
				text: z.string(),
				postId: z.string(),
				likes: z.number(),
			}),
		},
	)

	.put(
		"/:id",
		async ({ params, body }) => {
			return await db
				.update(comments)
				.set(body)
				.where(eq(comments.id, params.id))
				.returning();
		},
		{
			body: z.object({
				name: z.string(),
				text: z.string(),
				likes: z.number(),
			}),
		},
	)

	.delete("/:id", async ({ params }) => {
		const comment = await db.delete(comments).where(eq(comments.id, params.id));

		await db
			.update(posts)
			.set({
				comments: sql`${posts.comments} - 1`,
			})
			.where(eq(posts.id, params.id));

		return comment;
	});
