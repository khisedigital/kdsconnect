/**
 * Icon fonts:
 * - iOS: provided by RNVectorIcons CocoaPods (`Fonts/*.ttf`) + Info.plist UIAppFonts
 * - Android: copied under android/app/src/main/assets/fonts
 *
 * Do not asset-link the same FontAwesome5 files into the iOS app target —
 * that duplicates CocoaPods copy and breaks the build ("Multiple commands produce").
 */
module.exports = {
  assets: [],
};
