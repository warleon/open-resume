import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";
import { work } from "@database/schemas/jsonresume/work";
import { highlight } from "@database/schemas/jsonresume/highlight";

export const work_highlight = sqliteTable(
  "work_highlight",
  {
    work: cuid2("work").references(() => work.id),
    highlight: cuid2("highlight")
      .references(() => highlight.id)
      .unique(),
  },
  (table) => [primaryKey({ columns: [table.work, table.highlight] })]
);
