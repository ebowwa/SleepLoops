#!/usr/bin/env bash
set -e  # exit on error
cd SleepLoops
expo install expo-dev-client
pnpm install
pnpm expo prebuild --platform ios
xed ios