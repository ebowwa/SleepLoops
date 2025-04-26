#!/usr/bin/env bash
set -e  # exit on error
cd SleepLoops
pnpm install
pnpm expo prebuild --platform ios
xed ios