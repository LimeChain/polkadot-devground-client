export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) {
    return {
      value: 0,
      unit: 'Bytes',
    };
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return {
    value: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
    unit: sizes[i],
  };
};

export const calculateObjectSize = (object: unknown): number => {
  const objectList = new WeakSet<object>();
  const stack = [object];
  let bytes = 0;

  while (stack.length) {
    const value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;
    } else if (typeof value === 'string') {
      bytes += value.length * 2; // 2 bytes per character for strings
    } else if (typeof value === 'number') {
      bytes += 8; // Numbers are typically 8 bytes (64-bit floating point)
    } else if (typeof value === 'bigint') {
      bytes += (value.toString().length * 2); // BigInt converted to string and counted as bytes
    } else if (typeof value === 'symbol') {
      bytes += (value.toString().length * 2); // Symbols are similar to strings
    } else if (typeof value === 'function') {
      // Functions don't typically take much space in state representation
      continue;
    } else if (typeof value === 'object' && value !== null) {
      if (objectList.has(value)) {
        continue; // Skip circular references
      }
      objectList.add(value);

      if (Array.isArray(value)) {
        value.forEach((item) => stack.push(item)); // Add array elements to the stack
      } else if (value instanceof Map) {
        // For Map, add both key and value to the stack
        value.forEach((v, k) => {
          stack.push(k);
          stack.push(v);
        });
      } else if (value instanceof Set) {
        // For Set, add each element to the stack
        value.forEach((v) => stack.push(v));
      } else {
        // Handle regular objects: add their keys and values to the stack
        const obj = value as Record<string, unknown>; // Cast value to an indexable object

        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            bytes += key.length * 2; // Each key is a string, 2 bytes per character
            stack.push(obj[key]); // Traverse into the value
          }
        }
      }
    }
  }

  return bytes;
};
