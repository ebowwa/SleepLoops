cd SleepLoops 
pnpm remove expo-dev-client
expo install
pnpm expo start --tunnel --clear || pnpm expo start