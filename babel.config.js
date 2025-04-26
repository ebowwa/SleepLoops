module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // removed expo-router/babel as it's deprecated in SDK 50+;
  };
};