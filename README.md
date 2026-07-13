# RaceHub v4.3b Modular Developer Preview

This build reorganises the tested v4.3a JavaScript into maintainable modules.

## No intended feature changes

Your storage key remains unchanged, so existing cars, results, records and progress are preserved.

## JavaScript structure

- `js/seed-data.js` — standard car and event data
- `js/core.js` — storage, migration and shared calculations
- `js/race-director.js` — hosted race-night flow
- `js/views.js` — Festival and Event screens
- `js/celebrations.js` — records, confetti and result handling
- `js/garage.js` — garage and car editing
- `js/control-centre.js` — records, settings and backup tools
- `js/bootstrap.js` — application startup
