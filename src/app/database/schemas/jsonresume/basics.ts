import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const basics = sqliteTable("basics", {
  name: text("name"),
  lable: text("lable"),
  image: text("image"),
  email: text("email"),
  phone: text("phone"),
  url: text("url"),
  summary: text("summary"),
  //TODO link locations
  //TODO link profiles
});

export type Basics = typeof basics.$inferSelect;
export type NewBasics = typeof basics.$inferInsert;
