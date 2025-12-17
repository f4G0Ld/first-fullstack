import { db } from "@/src/lib/db/database";
import { posts } from "@/src/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { Elysia } from "elysia";
import z from "zod/v4";

export const postsRoutes = new Elysia({
	name: "postsRoutes",
	prefix: "/posts",
})

	.get("/", async () => {
		return await db.query.posts.findMany({
			orderBy: desc(posts.createdAt),
		});
	})

	.get("/:id", async ({ params }) => {
		return await db.query.posts.findFirst({
			where: eq(posts.id, params.id),
			// orderBy: desc(posts.createdAt),
		});
	})

	.post(
		"/",
		async ({ body }) => {
			return await db.insert(posts).values(body).returning();
		},
		{
			body: z.object({
				title: z.string(),
				name: z.string(),
				description: z.string(),
			}),
		},
	)

	.put(
		"/:id",
		async ({ params, body }) => {
			return await db
				.update(posts)
				.set(body)
				.where(eq(posts.id, params.id))
				.returning();
		},
		{
			body: z.object({
				title: z.string(),
				name: z.string(),
				description: z.string(),
			}),
		},
	)

	.put("/:id/like", async ({ params }) => {
		return await db
			.update(posts)
			.set({
				likes: sql`${posts.likes} + 1`,
			})
			.where(eq(posts.id, params.id))
			.returning();
	})

	.put("/:id/unlike", async ({ params }) => {
		return await db
			.update(posts)
			.set({
				likes: sql`GREATEST(${posts.likes} - 1, 0)`,
			})
			.where(eq(posts.id, params.id))
			.returning();
	})

	.delete("/:id", async ({ params }) => {
		await db.delete(posts).where(eq(posts.id, params.id));
	});
