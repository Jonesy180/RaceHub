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
