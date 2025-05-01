// Import the base configuration from app.json
const baseConfig = require('./app.json');

// Export a function that returns the configuration
module.exports = () => {
  // Try to load local config if it exists
  let localConfig = {};
  try {
    localConfig = require('./app.local.json');
  } catch {
    // Local config doesn't exist, that's fine
  }

  // Merge configurations
  return {
    ...baseConfig,
    expo: {
      ...baseConfig.expo,
      ...(localConfig.expo || {}),
      // Ensure plugins are properly merged
      plugins: [
        ...baseConfig.expo.plugins,
        "expo-router",
        "expo-asset",
        "expo-localization"
      ],
      // Make sure we're not using development client
      // which would prevent opening in Expo Go
      developmentClient: false
    }
  };
};
