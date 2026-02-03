export function generateNormalizedEnName(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "") // 記号除去
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(" ");
}
