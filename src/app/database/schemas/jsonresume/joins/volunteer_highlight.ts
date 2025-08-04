import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";
import { volunteer } from "@database/schemas/jsonresume/volunteer";
import { highlight } from "@database/schemas/jsonresume/highlight";

export const volunteer_highlight = sqliteTable(
  "volunteer_highlight",
  {
    volunteer: cuid2("volunteer").references(() => volunteer.id),
    highlight: cuid2("highlight")
      .references(() => highlight.id)
      .unique(),
  },
  (table) => [primaryKey({ columns: [table.volunteer, table.highlight] })]
);
