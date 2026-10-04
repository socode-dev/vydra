export const normalizeCategoryName = (value) =>
  String(value ?? "").trim().replace(/\s+/g, " ").toLocaleLowerCase();

export const categoryNameExists = (name, categories = []) => {
  const normalizedName = normalizeCategoryName(name);
  if (!normalizedName) return false;

  return categories.some(
    (category) => normalizeCategoryName(category?.name ?? category) === normalizedName,
  );
};
