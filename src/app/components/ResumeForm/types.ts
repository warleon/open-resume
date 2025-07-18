export type CreateHandleChangeArgsWithDescriptions<T> =
  | [field: Exclude<keyof T, "descriptions" | "highlights" | "keywords" | "roles">, value: string]
  | [field: "descriptions" | "highlights" | "keywords" | "roles", value: string[]];
