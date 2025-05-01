# Can Expo CLI generate an .ipa locally?

**No.** The core Expo CLI (`expo`) does not itself compile and archive an iOS `.ipa`—you must generate (or prebuild) a native Xcode project and then invoke Xcode’s build tools (either via `xcodebuild` or via `eas build --local`).

## Why Expo CLI alone can’t produce an `.ipa`

- **`expo build:ios` is cloud-only.**  
  The legacy `expo build:ios` command always runs on Expo’s servers and cannot be used fully offline or locally  ([How to generate an .ipa using expo - Reddit](https://www.reddit.com/r/expo/comments/12de15v/how_to_generate_an_ipa_using_expo/?utm_source=chatgpt.com)).

- **`expo run:ios` targets simulator or device only.**  
  `expo run:ios` will build and launch your app on a simulator or connected device, but does not create an archived `.xcarchive` or `.ipa` for distribution  ([Run EAS Build locally with local flag - Expo Documentation](https://docs.expo.dev/build-reference/local-builds/?utm_source=chatgpt.com)).

## Local alternatives

1. **EAS Build with `--local`**  
   You can install the EAS CLI and run:  
   ```bash
   eas build --platform ios --local --profile production
   ```  
   This will perform the same archive/export steps as the cloud service, but entirely on your Mac with Xcode installed  ([Run EAS Build locally with local flag - Expo Documentation](https://docs.expo.dev/build-reference/local-builds/?utm_source=chatgpt.com)).

2. **Manual `xcodebuild`**  
   - Use `npx expo prebuild --platform ios` (once) to generate `ios/YourApp.xcworkspace`.  
   - Then:
     ```bash
     xcodebuild archive \
       -workspace ios/YourApp.xcworkspace \
       -scheme YourApp \
       -configuration Release \
       -archivePath ./build/YourApp.xcarchive

     xcodebuild -exportArchive \
       -archivePath ./build/YourApp.xcarchive \
       -exportOptionsPlist ./build/ExportOptions.plist \
       -exportPath ./build/YourApp.ipa
     ```  
   This approach bypasses any Expo-specific build commands—Xcode handles the entire compile & archive process  ([How to build an iOS Expo App without using EAS Build - Dev Genius](https://blog.devgenius.io/how-to-build-an-ios-expo-app-without-using-eas-build-78bfc4002a0f?utm_source=chatgpt.com)).

### TL;DR

- **Expo CLI alone** cannot archive an `.ipa`.  
- Use **EAS CLI locally** (`eas build --local`) or  
- **Prebuild + Xcode** (`xcodebuild archive` & `-exportArchive`) on your machine.
