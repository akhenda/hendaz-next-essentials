export const modules = {
  ...import.meta.glob("./schema.ts"),
  ...import.meta.glob("./queries.ts"),
  ...import.meta.glob("./mutations.ts"),
  ...import.meta.glob("./actions.ts"),
};
