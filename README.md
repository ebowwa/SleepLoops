# SleepLoops

A minimalist iOS sleep cycle tracker that helps you wake up refreshed by aligning your alarm with natural 90-minute sleep cycles.

## Features

- **Sleep Cycle Optimization**: Calculates optimal wake times based on 90-minute REM cycles
- **Smart Wake Times**: Suggests 3-6 cycle wake times from your current bedtime
- **Notification Scheduling**: Set wake-up notifications directly from the app
- **Sleep History**: Track your sleep patterns over time
- **Dark Mode**: Automatic theme switching based on system preferences
- **iOS Widgets**: Quick access to wake time suggestions from your home screen
- **Tutorial**: Interactive onboarding to get you started

## Tech Stack

- **React Native** with **Expo** (SDK 52)
- **TypeScript** for type safety
- **MobX** for state management
- **SQLite** for local data persistence
- **Expo Router** for navigation
- **iOS Widgets** in Swift/SwiftUI

## Getting Started

### Prerequisites

- Node.js 18+ 
- iOS Simulator or physical iOS device
- Xcode (for iOS development)

### Installation

```bash
# Clone the repository
git clone https://github.com/ebowwa/SleepLoops.git
cd SleepLoops

# Install dependencies
npm install

# Install iOS pods
cd ios && pod install && cd ..
```

### Development

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Start with dev client
npm run start:dev

# Start with tunnel (for testing on physical device)
npm run start:go
```

## Project Structure

```
SleepLoops/
├── app/                  # Expo Router screens
├── src/
│   ├── components/       # React components
│   ├── contexts/         # React contexts (Theme, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── screens/         # Screen components
│   ├── stores/          # MobX stores
│   └── styles/          # Shared styles
├── ios/
│   ├── SleepLoops/      # iOS native code
│   └── SleepLoopsWidget/ # iOS widget extension
├── assets/              # Images and static assets
└── scripts/             # Build and utility scripts
```

## Data Persistence

The app uses a hybrid approach for data storage:

- **SQLite**: Core sleep session data via `expo-sqlite`
- **AsyncStorage**: User preferences, theme settings, and UI state

See [Issue #2](https://github.com/ebowwa/SleepLoops/issues/2) for detailed architecture discussion.

## Building for Production

### Using EAS Build (Cloud)

```bash
# Build for iOS
eas build --platform ios
```

### Local Build

See [Issue #3](https://github.com/ebowwa/SleepLoops/issues/3) for detailed local IPA generation instructions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

**Elijah Arbee** - [@ebowwa](https://github.com/ebowwa)

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Sleep cycle science based on [90-minute REM cycles](https://www.sleepfoundation.org/stages-of-sleep)