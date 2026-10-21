/** Pull the first four-digit year out of strings like "1907", "c. 1810" or "1931-03-23". */
export function yearOf(value?: string): number | undefined {
  const m = value?.match(/\d{4}/);
  return m ? Number(m[0]) : undefined;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/** "1931-03-23" -> "23 March 1931"; anything else is shown as written. */
export function formatDate(value?: string): string {
  if (!value) return "";
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return value;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}
