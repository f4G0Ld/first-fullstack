import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

export const posts = pg.pgTable("posts", {
  id: pg
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),

  imageId: pg.varchar({ length: 255 }),
  title: pg.varchar({ length: 255 }).notNull(),

  name: pg.varchar({ length: 255 }).notNull(),

  description: pg.text().notNull(),

  likes: pg.integer().default(0),

  comments: pg.integer().default(0),

  createdAt: pg.timestamp().notNull().defaultNow(),
});

export const postsRelations = relations(posts, ({ many }) => ({
  comments: many(comments),
}));

export const comments = pg.pgTable("comments", {
  id: pg
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),

  name: pg.text().notNull(),

  text: pg.text().notNull(),

  postId: pg
    .varchar({ length: 255 })
    .notNull()
    .references(() => posts.id, { onDelete: "cascade", onUpdate: "cascade" }),

  createdAt: pg.timestamp().notNull().defaultNow(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));
