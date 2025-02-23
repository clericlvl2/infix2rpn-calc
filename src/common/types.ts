export type ObjectValuesAsUnion<T extends Record<string, string>> = T[keyof T];
