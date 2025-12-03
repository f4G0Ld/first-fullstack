import Elysia from "elysia";
import { db } from "../lib/db/database";
import { comments } from "../lib/db/schema";
import z from "zod/v4";
import { eq } from "drizzle-orm";

export const commentsRoutes = new Elysia({
	name: "commentRoutes",
	prefix: "/comments",
})


    .get("/", async () => {
        return await db.select().from(comments);
    })

    .post('/', async ({body}) => {
        return await db.insert(comments).values(body).returning()
    }, {
        body: z.object({
            name: z.string(),
            text: z.string(),
            postId: z.string(),
            likes: z.number()
        })
    })

    .put('/:id', async ({params, body}) => {
        return await db.update(comments).set(body).where(eq(comments.id, params.id)).returning()
    }, {
        body: z.object({
            name: z.string(),
            text: z.string(),
            likes: z.number()
        })
    })

    .delete('/:id', async ({params}) => {
        await db.delete(comments).where(eq(comments.id, params.id))
    })