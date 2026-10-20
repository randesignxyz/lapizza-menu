const STORAGE_KEY = 'lapizza-favourites';

export function readFavourites(storage) {
  try {
    const value = JSON.parse(
      (storage ?? globalThis.localStorage).getItem(STORAGE_KEY) || '[]',
    );
    return new Set(
      Array.isArray(value) ? value.filter((id) => typeof id === 'string') : [],
    );
  } catch {
    return new Set();
  }
}

export function writeFavourites(saved, storage) {
  try {
    (storage ?? globalThis.localStorage).setItem(
      STORAGE_KEY,
      JSON.stringify([...saved]),
    );
  } catch {
    // Browsing still works when storage is full or disabled.
  }
}
