import { test } from "node:test";
import assert from "node:assert/strict";
import { totalRides, ridesByCity, ridesByMonth, monthLabel, busiestDayByCity, dayLabel } from "../site/src/stats.js";

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

test("monthLabel names a month in English with its year", () => {
  assert.equal(monthLabel("2026-07"), "July 2026");
});

test("monthLabel names the first and last months of the year", () => {
  assert.equal(monthLabel("2027-01"), "January 2027");
  assert.equal(monthLabel("2026-12"), "December 2026");
});

test("busiestDayByCity gives each city the day it had its highest rides", () => {
  const days = [
    { date: "2026-07-01", city: "Boston", rides: 113 },
    { date: "2026-07-02", city: "Boston", rides: 165 },
    { date: "2026-07-01", city: "Miami", rides: 200 },
    { date: "2026-07-02", city: "Miami", rides: 144 },
  ];
  assert.deepEqual(busiestDayByCity(days), [
    { city: "Boston", rides: 165, dates: ["2026-07-02"] },
    { city: "Miami", rides: 200, dates: ["2026-07-01"] },
  ]);
});

test("busiestDayByCity keeps every tied busiest day, in date order", () => {
  const tied = [
    { date: "2026-08-29", city: "Boston", rides: 165 },
    { date: "2026-08-02", city: "Boston", rides: 164 },
    { date: "2026-08-23", city: "Boston", rides: 165 },
  ];
  assert.deepEqual(busiestDayByCity(tied), [
    { city: "Boston", rides: 165, dates: ["2026-08-23", "2026-08-29"] },
  ]);
});

test("busiestDayByCity lists cities in alphabetical order", () => {
  const days = [
    { date: "2026-07-01", city: "Miami", rides: 144 },
    { date: "2026-07-01", city: "Denver", rides: 82 },
    { date: "2026-07-01", city: "Boston", rides: 113 },
  ];
  assert.deepEqual(
    busiestDayByCity(days).map((d) => d.city),
    ["Boston", "Denver", "Miami"],
  );
});

test("busiestDayByCity compares rides given as text by number, not as text", () => {
  const mixed = [
    { date: "2026-07-01", city: "Boston", rides: "99" },
    { date: "2026-07-02", city: "Boston", rides: "100" },
    { date: "2026-07-03", city: "Boston", rides: 98 },
  ];
  assert.deepEqual(busiestDayByCity(mixed), [
    { city: "Boston", rides: 100, dates: ["2026-07-02"] },
  ]);
});

test("busiestDayByCity uses each city's own rides, not the day's total across cities", () => {
  const days = [
    { date: "2026-07-01", city: "Boston", rides: 50 },
    { date: "2026-07-01", city: "Miami", rides: 60 },
    { date: "2026-07-02", city: "Boston", rides: 70 },
    { date: "2026-07-02", city: "Miami", rides: 10 },
  ];
  assert.deepEqual(busiestDayByCity(days), [
    { city: "Boston", rides: 70, dates: ["2026-07-02"] },
    { city: "Miami", rides: 60, dates: ["2026-07-01"] },
  ]);
});

test("busiestDayByCity gives the same result whatever order the rows arrive in", () => {
  const days = [
    { date: "2026-08-23", city: "Boston", rides: 165 },
    { date: "2026-08-02", city: "Denver", rides: 115 },
    { date: "2026-08-29", city: "Boston", rides: 165 },
    { date: "2026-08-03", city: "Denver", rides: 90 },
    { date: "2026-08-01", city: "Boston", rides: 120 },
  ];
  const expected = [
    { city: "Boston", rides: 165, dates: ["2026-08-23", "2026-08-29"] },
    { city: "Denver", rides: 115, dates: ["2026-08-02"] },
  ];
  assert.deepEqual(busiestDayByCity(days), expected);
  assert.deepEqual(busiestDayByCity([...days].reverse()), expected);
});

test("dayLabel names a day with its weekday, month, day and year in English", () => {
  assert.equal(dayLabel("2026-08-23"), "Sun, Aug 23, 2026");
});

test("dayLabel drops the leading zero from a single-digit day", () => {
  assert.equal(dayLabel("2026-08-02"), "Sun, Aug 2, 2026");
});

test("dayLabel names days across months and weekdays", () => {
  assert.equal(dayLabel("2026-07-01"), "Wed, Jul 1, 2026");
  assert.equal(dayLabel("2026-08-15"), "Sat, Aug 15, 2026");
  assert.equal(dayLabel("2026-09-30"), "Wed, Sep 30, 2026");
  assert.equal(dayLabel("2027-01-01"), "Fri, Jan 1, 2027");
});

test("dayLabel gives the date's own weekday for a viewer west of UTC", () => {
  const original = process.env.TZ;
  process.env.TZ = "America/Los_Angeles";
  try {
    assert.equal(dayLabel("2026-08-23"), "Sun, Aug 23, 2026");
  } finally {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  }
});
