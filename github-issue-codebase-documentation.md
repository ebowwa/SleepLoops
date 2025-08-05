# SleepLoops Codebase Documentation

## Overview
SleepLoops is a React Native/Expo application designed to help users optimize their sleep by timing sleep/wake cycles to natural 90-minute REM cycles. The app is currently iOS-only and provides sleep tracking, smart notifications, and personalized sleep recommendations.

## Tech Stack

### Core Dependencies
- **React Native**: 0.76.9
- **Expo SDK**: 52.0.0
- **TypeScript**: 5.8.3
- **State Management**: MobX 6.13.7 + mobx-react-lite
- **Navigation**: expo-router 4.0.20
- **Database**: expo-sqlite 15.1.4
- **UI Components**: 
  - @expo/vector-icons
  - react-native-gesture-handler
  - react-native-safe-area-context
  - react-native-svg
  - react-native-chart-kit

### Key Features

#### 1. Sleep Cycle Calculation
- Based on 90-minute sleep cycles
- Calculates optimal bedtimes given a wake time
- Calculates optimal wake times given a bedtime
- Includes 15-minute buffer for falling asleep

#### 2. Notification System
- Bedtime reminders
- Wake-up notifications
- Configurable notification scheduling
- Permission handling

#### 3. Data Persistence
- SQLite database for sleep session storage
- AsyncStorage for user preferences and notification IDs
- Automatic database initialization and migration

#### 4. User Interface
- Dark/Light theme support
- Multi-language support (i18n)
- Calendar view for weekly sleep schedule
- Historical sleep data visualization
- Tutorial/onboarding flow

## Project Structure

```
SleepLoops/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Root layout with theme provider
│   ├── index.tsx            # Entry point
│   ├── home.tsx            # Main home screen with modals
│   ├── settings.tsx        # Settings screen
│   ├── splash.tsx          # Splash screen
│   ├── tutorial.tsx        # Tutorial screen
│   └── wiki.tsx            # Information/wiki screen
├── src/
│   ├── components/         # Reusable components
│   │   ├── ArrowTutorialOverlay.tsx
│   │   ├── Header.tsx
│   │   ├── PillToggle.tsx
│   │   ├── Schedule.tsx
│   │   └── SurveyAlert.tsx
│   ├── contexts/          # React contexts
│   │   └── ThemeContext.tsx
│   ├── data/             # Static data
│   │   └── wikiContent.ts
│   ├── hooks/            # Custom hooks
│   │   └── useSurveyPrompt.ts
│   ├── models/           # Data models
│   │   └── content.ts
│   ├── screens/          # Screen components
│   │   ├── HistoryScreen.tsx
│   │   ├── HomeScreen.tsx    # Wake time selector
│   │   ├── SleepAtScreen.tsx # Sleep time selector
│   │   ├── SplashScreen.tsx
│   │   └── TutorialScreen.tsx
│   ├── stores/           # MobX stores
│   │   └── SleepStore.ts
│   ├── styles/           # Theme and styling
│   │   └── theme.ts
│   ├── utils/            # Utility functions
│   │   └── notifications.ts
│   └── i18n.ts          # Internationalization setup
├── ios/                  # iOS native code
├── assets/              # Images and icons
└── scripts/             # Build and deployment scripts
```

## Key Components

### SleepStore (MobX Store)
Located at `src/stores/SleepStore.ts`
- Manages sleep session state
- Handles SQLite database operations
- Provides methods for:
  - Starting/ending sleep sessions
  - Loading historical data
  - Calculating recommended wake times
  - App reset functionality

### HomeScreen
Located at `src/screens/HomeScreen.tsx`
- Wake time selector
- Calculates optimal bedtimes based on selected wake time
- Schedules bedtime reminder notifications
- Persists schedule to AsyncStorage

### SleepAtScreen
Located at `src/screens/SleepAtScreen.tsx`
- Sleep time selector
- Calculates optimal wake times based on selected bedtime
- Schedules wake-up notifications

### Notification System
Located at `src/utils/notifications.ts`
- Configures notification handlers
- Provides utilities for scheduling notifications
- Handles immediate and time-based triggers

## Build Configuration

### App Configuration
- **Bundle ID**: com.ebowwa.sleeploops
- **Version**: 1.0.1
- **Platforms**: iOS only
- **SDK Version**: Expo SDK 52

### EAS Build Profiles
1. **development**: Development client for internal testing
2. **development-simulator**: Simulator builds
3. **preview**: Internal distribution
4. **production**: App Store distribution

### Build Scripts
- `build-ios.sh`: Production iOS build with CocoaPods
- `build_local.sh`: Local development build
- `dev_runner.sh`: Development server runner
- `distributer_build.sh`: Distribution build helper

## Permissions Required
- **Notifications**: For sleep reminders and wake alerts
- **Calendar Access**: For weekly sleep schedule integration
- **Reminders Access**: For reminder integration

## Development Setup

### Prerequisites
- Node.js (with pnpm)
- Expo CLI
- EAS CLI
- Xcode (for iOS development)
- CocoaPods

### Running Locally
```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Start with dev client
pnpm start:dev

# Run on iOS
pnpm ios
```

### Building
```bash
# Local iOS build
./build_local.sh

# Production iOS build
./build-ios.sh

# EAS cloud build
eas build --platform ios --profile production
```

## Current Status
- iOS app is functional and configured
- All core features implemented
- Ready for App Store submission
- Version 1.0.1

## Future Considerations
- Android support (platform files exist but not actively maintained)
- Widget extension support (infrastructure exists)
- Enhanced sleep analytics
- Cloud sync capabilities
- Apple Health integration

## Known Configuration Files
- `app.json` - Expo configuration
- `eas.json` - EAS Build configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `metro.config.js` - Metro bundler config
- `babel.config.js` - Babel transpiler config

## Repository Info
- **GitHub**: https://github.com/ebowwa/SleepLoops.git
- **Main Branch**: main
- **Last Commit**: Initialized iOS project with widget extension and configs