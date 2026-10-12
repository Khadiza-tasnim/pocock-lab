import { test } from "node:test";
import assert from "node:assert/strict";
import { totalRides, ridesByCity, ridesByMonth } from "../site/src/stats.js";

const rows = [
  { date: "2026-07-01", city: "Miami", rides: "10" },
  { date: "2026-07-01", city: "Boston", rides: "20" },
  { date: "2026-07-02", city: "Boston", rides: 30 },
];

test("totalRides sums the rides column", () => {
  assert.equal(totalRides(rows), 60);
});

test("ridesByCity totals per city in alphabetical order", () => {
  assert.deepEqual(ridesByCity(rows), [
    { city: "Boston", rides: 50 },
    { city: "Miami", rides: 10 },
  ]);
});

test("ridesByMonth sums every city's rides in a month into one monthly total", () => {
  const july = [
    { date: "2026-07-01", city: "Boston", rides: 113 },
    { date: "2026-07-01", city: "Denver", rides: 82 },
    { date: "2026-07-15", city: "Miami", rides: 144 },
  ];
  assert.deepEqual(ridesByMonth(july), [{ month: "2026-07", rides: 339 }]);
});

test("ridesByMonth sums rides given as text or as numbers", () => {
  const mixed = [
    { date: "2026-08-01", city: "Boston", rides: "117" },
    { date: "2026-08-02", city: "Boston", rides: 120 },
  ];
  assert.deepEqual(ridesByMonth(mixed), [{ month: "2026-08", rides: 237 }]);
});

test("ridesByMonth lists months in date order even when rows are not", () => {
  const shuffled = [
    { date: "2026-09-03", city: "Miami", rides: 30 },
    { date: "2026-07-10", city: "Boston", rides: 10 },
    { date: "2026-08-20", city: "Denver", rides: 20 },
    { date: "2026-07-11", city: "Miami", rides: 5 },
  ];
  assert.deepEqual(ridesByMonth(shuffled), [
    { month: "2026-07", rides: 15 },
    { month: "2026-08", rides: 20 },
    { month: "2026-09", rides: 30 },
  ]);
});

test("ridesByMonth keeps the same month in different years apart", () => {
  const twoJulys = [
    { date: "2027-07-01", city: "Boston", rides: 7 },
    { date: "2026-07-01", city: "Boston", rides: 6 },
  ];
  assert.deepEqual(ridesByMonth(twoJulys), [
    { month: "2026-07", rides: 6 },
    { month: "2027-07", rides: 7 },
  ]);
});

test("ridesByMonth returns no months for no rows", () => {
  assert.deepEqual(ridesByMonth([]), []);
});
