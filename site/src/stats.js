// Summaries of ride rows: [{ date, city, rides }, ...] with rides as strings or numbers.

export function totalRides(rows) {
  return rows.reduce((sum, row) => sum + Number(row.rides), 0);
}

// Total rides per city, sorted by city name.
export function ridesByCity(rows) {
  const totals = new Map();
  for (const row of rows) {
    totals.set(row.city, (totals.get(row.city) ?? 0) + Number(row.rides));
  }
  return [...totals.entries()]
    .map(([city, rides]) => ({ city, rides }))
    .sort((a, b) => a.city.localeCompare(b.city));
}

// Monthly total of rides across all cities, one entry per month ("YYYY-MM"),
// in date order ("YYYY-MM" text sorts chronologically).
export function ridesByMonth(rows) {
  const totals = new Map();
  for (const row of rows) {
    const month = row.date.slice(0, 7);
    totals.set(month, (totals.get(month) ?? 0) + Number(row.rides));
  }
  return [...totals.entries()]
    .map(([month, rides]) => ({ month, rides }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Display text for a month ("2026-07" -> "July 2026"), always in English.
export function monthLabel(month) {
  const [year, monthNumber] = month.split("-");
  return `${MONTH_NAMES[Number(monthNumber) - 1]} ${year}`;
}

// Each city's busiest day: its highest rides on one day across all rows,
// with every date that reached that count.
export function busiestDayByCity(rows) {
  const busiest = new Map();
  for (const row of rows) {
    const rides = Number(row.rides);
    const best = busiest.get(row.city);
    if (!best || rides > best.rides) {
      busiest.set(row.city, { city: row.city, rides, dates: [row.date] });
    } else if (rides === best.rides) {
      best.dates.push(row.date);
    }
  }
  return [...busiest.values()]
    .map((best) => ({ ...best, dates: best.dates.sort() }))
    .sort((a, b) => a.city.localeCompare(b.city));
}
