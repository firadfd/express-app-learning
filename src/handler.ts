export function tryParseJSON(str: string): any {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}
