import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";
import { basics } from "@database/schemas/jsonresume/basics";
import { profile } from "@database/schemas/jsonresume/profile";

export const basics_profile = sqliteTable(
  "basics_profile",
  {
    basics: cuid2("basics").references(() => basics.id),
    profile: cuid2("profile")
      .references(() => profile.id)
      .unique(),
  },
  (table) => [primaryKey({ columns: [table.basics, table.profile] })]
);
