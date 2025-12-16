import { db } from "@/src/lib/db/database";
import { posts } from "@/src/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import z from "zod/v4";
import { s3 } from "../server/s3";

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
      console.log({ body });
      let imageId: string | undefined;
      if (body.image) {
        imageId = Bun.randomUUIDv7();
        const meta = s3.file(imageId);
        await meta.write(body.image, {
          type: body.image.type,
        });
      }

      return await db
        .insert(posts)
        .values({
          ...body,
          imageId,
        })
        .returning();
    },
    {
      body: z.object({
        image: z.file().nullish(),
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
