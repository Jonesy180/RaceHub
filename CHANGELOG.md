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
