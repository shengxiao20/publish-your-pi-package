const packageName = process.argv[2];

if (!packageName) {
  throw new Error("Usage: node scripts/npm-downloads.mjs <package-name>");
}

const DAY = 86_400_000;
const formatDate = (date) => date.toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - DAY);
let start = new Date("2015-01-10T00:00:00Z");
let total = 0;

while (start <= yesterday) {
  const end = new Date(Math.min(start.getTime() + 364 * DAY, yesterday.getTime()));
  const period = `${formatDate(start)}:${formatDate(end)}`;
  const url = `https://api.npmjs.org/downloads/point/${period}/${encodeURIComponent(packageName)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Unable to query ${packageName}: npm API returned ${response.status} ${response.statusText}`,
    );
  }

  const { downloads } = await response.json();
  total += downloads;
  start = new Date(end.getTime() + DAY);
}

console.log(`${packageName}: ${total.toLocaleString()} downloads`);
