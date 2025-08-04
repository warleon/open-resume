import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";
import { interest } from "database/schemas/jsonresume/interest";
import { keyword } from "database/schemas/jsonresume/keyword";

export const interest_keyword = sqliteTable(
  "interest_keyword",
  {
    interest: cuid2("interest").references(() => interest.id),
    keyword: cuid2("keyword").references(() => keyword.id),
  },
  (table) => [primaryKey({ columns: [table.interest, table.keyword] })]
);
