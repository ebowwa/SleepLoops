# Note

• app.local.json – with your custom scheme and expo-dev-client.
• app.expo.json – without the custom URI or dev-client plugin, for Expo Go.

To switch:

For local builds/dev client:
```bash
mv app.local.json app.json
pnpm expo start --tunnel --clear --dev-client
```
then `pnpm expo run:ios` or `run:android`.
For Expo Go:
```bash
mv app.expo.json app.json
pnpm expo start --tunnel --clear
This ensures each mode uses the correct config without manual edits. Let me know if you’d like a script to automate the swap!

Q: this doesnt help with local builds like `eas build --platform ios --local`, does it? Would i use the `app.local.json` config in this case?
A: Yes, you would use the `app.local.json` config for local builds.