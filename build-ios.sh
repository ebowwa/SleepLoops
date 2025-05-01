#!/bin/bash
set -e

# Ensure CocoaPods is in the PATH
export PATH="$PATH:/opt/homebrew/bin:/usr/local/bin"

# Verify CocoaPods is available
if ! command -v pod &> /dev/null; then
    echo "Error: CocoaPods not found. Please install CocoaPods."
    exit 1
fi

echo "Using CocoaPods from: $(which pod)"
echo "CocoaPods version: $(pod --version)"

# Clean iOS directory to ensure fresh build
rm -rf ios/Pods
rm -rf ios/build

# Install pods manually first
cd ios
pod install
cd ..

# Run EAS build with the local flag
pnpm eas build --platform ios --local --profile production
