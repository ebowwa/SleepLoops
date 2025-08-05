# SleepLoops

A minimalist iOS sleep cycle tracker that helps you wake up refreshed by aligning your alarm with natural 90-minute sleep cycles.

**Think of it as Pomodoro for sleep** - instead of 25-minute work blocks, it's 90-minute sleep cycles. The app calculates optimal wake times based on completing full REM cycles, so you wake up between cycles rather than during deep sleep.

## Features

- **Sleep Cycle Optimization**: Calculates optimal wake times based on 90-minute REM cycles
- **Smart Wake Times**: Suggests 3-6 cycle wake times from your current bedtime
- **Notification Scheduling**: Set wake-up notifications directly from the app
- **Sleep History**: Track your sleep patterns over time
- **Dark Mode**: Automatic theme switching based on system preferences
- **iOS Widgets**: Quick access to wake time suggestions from your home screen
- **Tutorial**: Interactive onboarding to get you started
- **Automatic Sleep Detection**: Detects sleep based on device inactivity (NEW!)

## TODO

- [ ] **Add "Active Hours" Setting**: Allow users to define hours when they're typically awake (e.g., late-night workers) to prevent false positive sleep detection during work sessions. See [Issue #10](https://github.com/ebowwa/SleepLoops/issues/10#issuecomment-3153105900) for context.

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

### Running on Physical iPhone Device

**Important**: Since this app includes a widget extension, you cannot use Expo Go. You need to use a development build.

#### Common Issues and Solutions

**Issue: Xcode Build Error - "Command PhaseScriptExecution failed"**
```
/usr/local/bin/node: No such file or directory
```

This happens because the Hermes build script looks for Node.js at `/usr/local/bin/node`, but on M1/M2 Macs with Homebrew, Node is installed at `/opt/homebrew/bin/node`.

**Solution**: Create a `.xcode.env.local` file in the ios directory:
```bash
echo "export NODE_BINARY=/opt/homebrew/bin/node" > ios/.xcode.env.local
```

**Issue: "Internal inconsistency error" in Xcode**

This is often related to React Native 0.76 dependency resolution issues.

**Solution**: Complete clean and rebuild:
```bash
# Clean everything
rm -rf ios/Pods ios/Podfile.lock ios/build ~/Library/Developer/Xcode/DerivedData/*

# Reinstall pods
cd ios && pod install && cd ..

# In Xcode:
# 1. Clean Build Folder (Shift+Cmd+K)
# 2. Build (Cmd+B)
# 3. Run (Cmd+R)
```

#### Alternative: Using Expo Tunnel

If Xcode builds are problematic, use the tunnel approach:

```bash
# We use pnpm, not npm
pnpm install

# Start with tunnel (works even if phone is on different network)
npx expo start --tunnel
```

This generates a QR code and URL like:
```
exp+sleep-loops://expo-development-client/?url=https%3A%2F%2F[random-id].exp.direct
```

On your iPhone:
1. Open the development build (previously installed via Xcode)
2. Enter the tunnel URL or scan the QR code
3. The app will reload with your latest changes

**Note**: The tunnel method is particularly useful when:
- Xcode builds are failing
- Testing on a device not on the same network
- Rapid iteration without rebuilding in Xcode

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

## Future Direction

### Current Reality Check

The core concept works - it's Pomodoro for sleep. But after analysis ([Issue #4](https://github.com/ebowwa/SleepLoops/issues/4)), **SleepLoops gets zero organic interest** despite being in a "hot" market ($3.9B+ sleep app industry). The problem: it's a feature masquerading as a product in a market dominated by content-driven apps like Calm ($7.7M/month revenue).

### Most Likely Next Step: AI-Generated Sleep Stories

**The Opportunity**: Merge with the existing [Stories repo](https://github.com/ebowwa/stories) to create AI-powered bedtime stories that could genuinely disrupt Calm's model. See [Issue #5](https://github.com/ebowwa/SleepLoops/issues/5) for full technical analysis.

**Why This Makes Sense**:
- **Existing foundation**: Stories repo already has OpenAI + TTS integration
- **Cost advantage**: Generate infinite personalized stories for ~$0.002 each vs. Calm's celebrity production costs
- **Technical feasibility**: Can integrate in ~2 weeks
- **Market gap**: No major player offers truly personalized AI stories

**Decision Framework**:
- **Build on SleepLoops** (faster to market, existing codebase)
- **Or start fresh** (cleaner positioning, better branding)
- **Focus energy elsewhere** (CleanShot gets actual organic interest)

**The honest assessment**: This pivot could work, but requires significant effort in a market where we currently have zero traction. Meanwhile, other projects (CleanShot) show real product-market fit.

### Alternative Paths

If not pursuing AI stories:
- **Keep as portfolio piece** - demonstrates clean React Native/Expo development
- **Open source** - could gain developer credibility
- **Minimal maintenance** - works as-is for the sleep cycle calculation use case
- **Focus elsewhere** - put energy into projects with proven traction

### NEW: Unified Vision - Why Not All Three?

**Latest Direction**: Instead of choosing between pivots, SleepLoops can become a comprehensive sleep wellness platform. See [Issue #13](https://github.com/ebowwa/SleepLoops/issues/13) for full discussion.

**The Triple Play**:
1. **Pomodoro for Sleep** (Core Feature)
   - 90-minute cycle optimization
   - Automatic sleep detection
   - Smart wake times

2. **AI-Generated Sleep Stories** (Engagement & Monetization)
   - Personalized bedtime stories via OpenAI
   - Cost advantage over Calm's celebrity recordings
   - Leverage existing [Stories repo](https://github.com/ebowwa/stories)

3. **CaringMind Integration** (Holistic Wellness)
   - Sleep data enriches AI companion insights
   - Bidirectional data sharing via App Groups
   - Story personalization based on wellness profile

**Why This Works**:
- **Unique Market Position**: No competitor offers all three
- **Natural Synergies**: Stories help you fall asleep → Cycles ensure quality sleep → CaringMind provides insights
- **Multiple Revenue Streams**: Freemium tracking, premium stories, ecosystem benefits

**Implementation Path**:
- Phase 1: Port Stories functionality (2 weeks)
- Phase 2: CaringMind data sharing (1 week)  
- Phase 3: Unified experience (1 week)

**The Bottom Line**: The $3.9B sleep market deserves a holistic solution. By combining these approaches, SleepLoops addresses the complete sleep journey: falling asleep, sleeping well, and waking refreshed.

Open to suggestions and contributions, but being realistic about market realities.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

**Elijah Arbee** - [@ebowwa](https://github.com/ebowwa)

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Sleep cycle science based on [90-minute REM cycles](https://www.sleepfoundation.org/stages-of-sleep)