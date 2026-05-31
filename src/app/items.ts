const ITEMS_STORAGE_KEY = "items";

function parseItems(value: string | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const items = JSON.parse(value);
    return Array.isArray(items) && items.every((item) => typeof item === "string")
      ? items
      : [];
  } catch {
    return [];
  }
}

export function getItems(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  return parseItems(window.localStorage.getItem(ITEMS_STORAGE_KEY));
}

export function saveItems(items: string[]) {
  window.localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
}

export function addItems(value: string | null | undefined): string[] {
  const newItems = (value ?? "")
    .split("\n")
    .filter((line) => line.trim() !== "");

  const items = [...getItems(), ...newItems];
  saveItems(items);
  return items;
}

export function clearItems() {
  window.localStorage.removeItem(ITEMS_STORAGE_KEY);
}
