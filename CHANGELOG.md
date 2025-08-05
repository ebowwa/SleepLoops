# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-08-05

### Added

#### Automatic Sleep Detection Feature (3 Phases)

**Phase 1: Core Activity Tracking**
- Implemented `ActivityTracker` service to monitor app state changes
- Added automatic sleep detection based on 30-minute inactivity threshold
- Integrated with MobX store for state management
- Added database migration to support `auto_detected` column in SQLite

**Phase 2: Enhanced Device Signals**
- Created `DeviceSignals` service for battery and brightness monitoring
- Added configurable sleep detection settings in Settings screen
- Implemented threshold slider (15-60 minutes) for customization
- Added new dependencies:
  - `expo-battery@~9.0.2`
  - `expo-brightness@~13.0.3`
  - `@react-native-community/slider@4.5.5`

**Phase 3: Visual Feedback & User Interaction**
- Completely redesigned History Screen with card-based UI
- Added swipe-to-delete functionality using `react-native-gesture-handler`
- Visual distinction between auto-detected (blue border) and manual sessions
- Added confirmation dialogs for session deletion
- Enhanced session display with icons, better typography, and shadows
- Added "Auto-detected" label with analytics icon

### Changed
- Updated `package.json` dependencies to SDK 52 compatible versions
- Modified `SleepStore` to support auto-detected sessions with notifications
- Enhanced translations with delete functionality strings
- Improved session history UI from basic list to modern card design

### Fixed
- Xcode build issues with Node.js path on M1/M2 Macs
- React Native 0.76 Hermes build script compatibility
- Dependency version conflicts with Expo SDK 52

### Developer Experience
- Added comprehensive troubleshooting guide in README
- Documented physical device setup with tunnel approach
- Created `.xcode.env.local` for Node binary path override

### Technical Details
- Database schema updated with backwards-compatible migration
- Proper TypeScript types for auto-detected sessions
- Integrated with existing notification system for sleep detection alerts
- Maintains app performance with efficient state management

## [1.0.1] - Previous Release
- Initial App Store release
- Basic sleep cycle tracking
- Manual sleep session recording
- Widget support