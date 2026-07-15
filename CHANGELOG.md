# RaceHub Changelog

## v4.4b — Live Championship Fields
- Era, Make and Open Championship fields now update automatically from the current garage.
- Newly added matching cars join an active Championship immediately.
- Removed the locked-field wording from the Championship selector.
- Existing Championship selections and results remain intact.

## v4.3e Time Display Fix
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
