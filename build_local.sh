#!/usr/bin/env bash
set -e  # exit on error
cd SleepLoops
pnpm install
eas build --platform ios --local

