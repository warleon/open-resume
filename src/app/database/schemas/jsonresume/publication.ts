import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const publication = sqliteTable("publication", {
  name: text("name"),
  publisher: text("publisher"),
  releaseDate: integer("releaseDate", { mode: "timestamp" }),
  url: text("url"),
  summary: text("summary"),
  // TODO link to user or resume
});

export type Publication = typeof publication.$inferSelect;
export type NewPublication = typeof publication.$inferInsert;
