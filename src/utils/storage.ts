/**
 * Set a value in Cache API
 * @param key The key under which the value will be stored
 * @param value The value to store
 */
export async function storageSetItem(
  key: string,
  value: unknown,
): Promise<void> {
  const cache = await caches.open('my-cache');
  const serializedValue = JSON.stringify(value);
  const response = new Response(serializedValue, {
    headers: { 'Content-Type': 'application/json' },
  });
  await cache.put(key, response);
}

/**
 * Get a value from Cache API
 * @param key The key of the value to retrieve
 * @returns The retrieved value, or null if not found
 */
export async function storageGetItem<T>(key: string): Promise<T | null> {
  const cache = await caches.open('my-cache');
  const response = await cache.match(key);
  if (!response) {
    return null;
  }
  const serializedValue = await response.text();
  return JSON.parse(serializedValue) as T;
}

/**
 * Remove a value from Cache API
 * @param key The key of the value to remove
 */
export async function storageRemoveItem(key: string): Promise<void> {
  const cache = await caches.open('my-cache');
  await cache.delete(key);
}

/**
 * Clear all values from Cache API
 */
export async function storageClear(): Promise<void> {
  const cache = await caches.open('my-cache');
  const keys = await cache.keys();
  for (const request of keys) {
    await cache.delete(request);
  }
}

/**
 * Clear values from Cache API by prefix or suffix
 * @param str The prefix or suffix to match keys against
 * @param isPrefix If true, match keys that start with `str`. If false, match keys that end with `str`.
 */
export async function storageClearByPrefixOrSuffix(
  str: string,
  isPrefix: boolean = true,
): Promise<void> {
  const cache = await caches.open('my-cache');
  const keys = await cache.keys();
  for (const request of keys) {
    const key = request.url.split('/').pop()!;
    if ((isPrefix && key.startsWith(str)) || (!isPrefix && key.endsWith(str))) {
      await cache.delete(request);
    }
  }
}

/**
 * Check if a key exists in Cache API
 * @param key The key to check
 * @returns True if the key exists, false otherwise
 */
export async function storageExists(key: string): Promise<boolean> {
  const cache = await caches.open('my-cache');
  const response = await cache.match(key);
  return response !== undefined;
}

/**
 * Get all keys from Cache API
 * @returns An array of all keys in Cache API
 */
export async function storageGetAllKeys(): Promise<string[]> {
  const cache = await caches.open('my-cache');
  const keys = await cache.keys();
  return keys.map((request) => request.url.split('/').pop()!); // Extracting key from URL
}
