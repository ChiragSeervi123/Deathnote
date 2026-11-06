/** [1,2,3,5] → "1–3, 5" */
export function formatEpisodes(nums: readonly number[]): string {
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const parts: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    const n = sorted[i];
    if (n !== undefined && prev !== undefined && n === prev + 1) {
      prev = n;
      continue;
    }
    if (start !== undefined && prev !== undefined) parts.push(start === prev ? `${start}` : `${start}–${prev}`);
    start = n;
    prev = n;
  }
  return parts.join(', ');
}
