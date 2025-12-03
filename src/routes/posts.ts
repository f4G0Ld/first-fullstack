import { db } from "@/src/lib/db/database";
import { posts } from "@/src/lib/db/schema";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import z from "zod/v4";

export const postsRoutes = new Elysia({
	name: "postsRoutes",
	prefix: "/posts",
})

	.get("/", async () => {
		return await db.select().from(posts);
	})

	.post("/", async ({ body }) => {
			return await db.insert(posts).values(body).returning();
		},
		{
			body: t.Object({
				title: t.String(),
				name: t.String(),
				description: t.String(),
			}),
		},
	)

	.put('/:id', async ({params, body}) => {
		return await db.update(posts).set(body).where(eq(posts.id, params.id)).returning()
	}, {
		body: z.object({
			title: z.string(),
			name: z.string(),
			description: z.string()
		})} 
	)

	.delete('/:id', async ({params}) => {
		await db.delete(posts).where(eq(posts.id, params.id))
	})