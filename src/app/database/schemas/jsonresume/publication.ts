import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/dist/sqlite-core";

export const publication = sqliteTable("publication", {
  id: cuid2("id").defaultRandom().primaryKey(),
  name: text("name"),
  publisher: text("publisher"),
  releaseDate: integer("releaseDate", { mode: "timestamp" }),
  url: text("url"),
  summary: text("summary"),
  // TODO link to user or resume
});

export type Publication = typeof publication.$inferSelect;
export type NewPublication = typeof publication.$inferInsert;
