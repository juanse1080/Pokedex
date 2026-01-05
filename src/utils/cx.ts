type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, boolean | null | undefined>
  | ClassValue[];

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isObject(
  value: unknown
): value is Record<string, boolean | null | undefined> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function processClassValue(input: ClassValue, result: Set<string>): void {
  if (!input) {
    return;
  }

  if (isString(input)) {
    result.add(input);
    return;
  }

  if (typeof input === "number") {
    result.add(String(input));
    return;
  }

  if (Array.isArray(input)) {
    for (const item of input) {
      processClassValue(item, result);
    }
    return;
  }

  if (isObject(input)) {
    for (const [key, value] of Object.entries(input)) {
      if (value) {
        result.add(key);
      }
    }
  }
}

export function cx(...inputs: ClassValue[]): string {
  const result = new Set<string>();

  for (const input of inputs) {
    processClassValue(input, result);
  }

  return Array.from(result).join(" ");
}
