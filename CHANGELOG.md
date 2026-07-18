# RaceHub v5.3.0 — Overall Leaderboard

- Adds a read-only Overall Leaderboard across the full RaceHub collection.
- Ranks fully completed cars by the combined total of all timed events.
- Uses Long Jump as the tie-breaker when total times are identical.
- Adds current leader, podium, gap-to-leader, Championship wins and Festival records.
- Shows collection qualification progress and cars closest to completing all six events.
- Keeps Era and Manufacturer Championships as the only raceable Championships.
- Retains the Hall of Fame below the new leaderboard.
- Updates the app and PWA cache to v5.3.0.

# RaceHub v5.2.15 — Queue Draw Experience

- Reveals newly generated Championship queues one car at a time.
- Adds an always-visible **Skip Draw** control during the reveal.
- Saves the complete queue before the animation begins, protecting it from refreshes or closures.
- Opens existing saved queues instantly without replaying the draw.
- Adapts reveal speed for longer Championship queues.
- Adds subtle sound and vibration feedback while respecting RaceHub settings.
- Updates the app and PWA cache to v5.2.15.

# RaceHub v5.2.14 — Persistent Championship Queues

- Replaces Random Pairs with a practical Race Night Queue.
- Saves a separate random running order for every Era and Manufacturer Championship.
- Restores each queue after closing, refreshing or restarting RaceHub.
- Self-cleans every saved queue against live completion data. A car completed in one Championship disappears from every other queue it belongs to without reshuffling the remaining cars.
- Adds Next Car and On Deck preview to the dashboard.
- Adds Open Saved Queue, Generate New Queue and Clear Queue controls.
- Keeps Single Pick and its no-repeat cycle.
- Establishes Overall Leaderboard as the name for the future read-only whole-project standings.
- Updates the app and PWA cache to v5.2.14.

# RaceHub v5.2.13 — Random Picker Sprint 2

- Adds Single, Full Order and Random Pairs draw modes.
- Adds a no-repeat draw cycle for unfinished cars.
- Shows how many cars remain before the cycle automatically refreshes.
- Adds a manual Reset Cycle control.
- Adds animated full-order and pair reveals with optional sound, vibration and confetti.
- Keeps Record History Sprint 2 unchanged.

## v5.2.12 — Record History Sprint 2
- Added animated Record History dashboard counters.
- Added real fastest, average and Long Jump performance highlights.
- Added richer record, Championship podium and completed-car cards.
- Added performance summary and clearer colour coding.

# RaceHub v5.2.12 — Record History Restore

- Restores the full **Your Racing Story** Record History experience introduced in v5.2.9.
- Restores Record, Championship and completed-car timeline entries, summary totals and filter chips.
- Restores the complete mobile-first Record History styling that was accidentally removed in v5.2.10.
- Keeps Random Picker Sprint 1 fully intact.
- Updates the stored app version and PWA cache to v5.2.12.

# RaceHub v5.2.10 — Random Picker Sprint 1

- Gives the Random Picker a dedicated orange visual identity.
- Adds live counts for available unfinished cars and loaded events.
- Improves the random selection reveal and selected-car presentation.
- Adds clearer opening-event details, Pick Again and Back to Dashboard actions.
- Adds mobile and reduced-motion polish.
- Updates the stored app version and PWA cache to v5.2.10.

# RaceHub v5.2.8 — Brand Colour Refresh

- Replaces the inherited purple/pink brand tint with RaceHub cyan, deep cyan and neutral slate tones.
- Keeps feature-specific colours for records, championships, success states and manufacturer accents.
- Removes release/version text from the normal app header while retaining it on the loading screen.
- Adds a polished About RaceHub signature panel to Settings.
- Credits Andy Jones & ChatGPT as the app's designers and developers.
- Updates the stored app version and PWA cache to v5.2.8.

# RaceHub v5.2.7 — Brand Identity

- Introduces the official cyan-and-white **RH shield** as the RaceHub brand mark.
- Replaces the old flag splash treatment with the full RaceHub wordmark and the tagline **Track • Record • Improve**.
- Adds new scalable SVG brand assets for the shield and horizontal wordmark.
- Rebuilds every PWA/app icon size and favicon around the official RH shield.
- Adds dedicated maskable Android icons and updates the web app manifest.
- Restyles the app header and splash screen to match the new dark cyan identity.
- Updates the stored app version and PWA cache to v5.2.7.

---

# RaceHub v5.2.6 — Statistics Facelift

- Replaces the More navigation tab with a dedicated Statistics screen.
- Adds a compact mobile headline grid for garage, completion, Championship and record totals.
- Adds a bright garage-completion progress panel.
- Adds Festival Record performance cards using live RaceHub result data.
- Adds ranked manufacturer completion rows with Garage wordmarks and accent colours.
- Adds racing activity summaries and a recent milestone feed.
- Keeps Settings, Backup and Record History accessible from the Statistics screen.
- Updates the stored app version and PWA cache to v5.2.6.

# RaceHub v5.2.5 — Dashboard Mobile Compact Pass

- Adds a final mobile-only CSS override so the two-column layout cannot be cancelled by earlier responsive rules.
- Displays Championships Completed as a compact horizontal strip beneath the two quick-stat cards.
- Updates the stored application data version to v5.2.5.
- Keeps the dashboard summary cards in a two-column mobile layout, including on narrow phones.
- Reduces summary-card height, padding and spacing for a fuller, more balanced phone view.
- Keeps Championships Completed full width beneath the first two quick-stat cards.
- Tightens the hero, record and Continue Racing panels without removing information.
- Refreshes the PWA cache for v5.2.5.

# RaceHub v5.2.4 — Dashboard Facelift

- Redesigned the Festival home screen as a focused Dashboard.
- Added a Current Championship hero with progress and a clear continue action.
- Added Cars Owned, Cars Completed, and Championships Completed summary cards.
- Added a tidy Latest Festival Record card showing the event, record, car, and relative date.
- Added a Continue Racing panel and a responsive mobile-first layout.

# RaceHub v5.2.4 — Hall of Fame Accents

- Added a gold accent strip and glow to Festival Records.
- Added blue accents to Era Championships and their expanded record cards.
- Added green accents to Manufacturer Championships and their expanded record cards.
- Updated chevrons and section headings to match each Hall of Fame category.
- Changed the ACTIVE Championship badge to a brighter green for instant recognition.
- Kept the styling subtle and responsive on desktop and mobile.
- Updated the PWA cache version.

# RaceHub v5.2.2 — Wordmarks & Manufacturer Accents

- Restored a consistent white wordmark watermark for every Garage manufacturer.
- Added a subtle manufacturer-coloured top accent, matching border tint and small header marker.
- Added curated colours for major marques and a stable premium palette fallback for every other manufacturer.
- Kept all accents restrained so car details remain clear on desktop and mobile.
- Updated the PWA cache version.

# RaceHub v5.2.0 — Manufacturer Watermarks

- Added subtle white manufacturer wordmark watermarks to Garage manufacturer cards.
- Watermarks are centred, responsive and displayed at low opacity for readability.
- Added automatic missing-logo fallback so Garage cards never break.
- Added `assets/logos` as the future-proof home for manufacturer SVG assets.
- Updated PWA cache to include the manufacturer watermark library.

---

# RaceHub v5.1.4 — Hall of Fame Browser

- Festival Records remain permanently visible.
- Added collapsible Era Championship and Manufacturer Championship record browsers.
- Championship records can now be viewed without changing the active Championship.
- Only one Championship record panel opens at a time.
- The active Championship is marked with an ACTIVE badge.
- Manufacturer Championships are ordered by garage size, then alphabetically.
- Added responsive mobile layouts for the new browser.

# RaceHub Changelog

## v5.0.0 — Live Championship Fields
- Era, Make and Open Championship fields now update automatically from the current garage.
- Newly added matching cars join an active Championship immediately.
- Removed the locked-field wording from the Championship selector.
- Existing Championship selections and results remain intact.

## v5.0.0 Time Display Fix
- Average-performance differences of 60 seconds or more now display as minutes and seconds.
- Example: 70.000 seconds now displays as 1 minute 10.000 seconds.
- Long Jump difference formatting and all average calculations are unchanged.

# Changelog

## v4.3a Developer Preview
### Added
- In-app Edit Car form.
- Cars completed and cars remaining counters.
- Garage progress labels.
- Data normalisation for older saved championships.

### Fixed
- Corrected a record-celebration title variable in the refactor source.

### Compatibility
- Keeps `RaceHub_v4_1_director_edition` as the storage key so the live championship remains available after updating.

## v4.3b Modular Developer Preview

### Changed
- Split the large `app.js` file into eight focused JavaScript modules.
- Updated the offline cache for the modular file structure.
- Preserved the existing RaceHub local-storage key and championship data.

### Intended behaviour
- No visible feature changes from v4.3a.

## v4.3d QoL Sprint 1

### Improved
- Brighter, thicker progress bars with smoother fill animation and an animated highlight.
- Stronger green, red and neutral performance feedback cards.
- Performance feedback now shows the saved result and event average side by side.
- Car-completion presentation now uses the shared polished progress styling.
- Updated offline cache name so installed copies receive the new assets.
