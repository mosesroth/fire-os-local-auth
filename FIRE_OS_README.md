# Testing expo-local-authentication on Fire OS

This app is designed to test the functionality of the expo-local-authentication package on Fire OS devices.

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Expo CLI installed (`npm install -g expo-cli`)
- A Fire OS device (Fire tablet or Fire TV)
- Developer options enabled on your Fire OS device

### Building and Installing the App

1. Install dependencies:
   ```
   cd local-auth-test
   npm install
   ```

2. Build the app for Android:
   ```
   npx expo prebuild --platform android
   cd android
   ./gradlew assembleDebug
   ```

3. The APK will be generated at `android/app/build/outputs/apk/debug/app-debug.apk`

4. Install the APK on your Fire OS device:
   - Enable "Apps from Unknown Sources" in your Fire OS settings
   - Transfer the APK to your Fire OS device (via email, cloud storage, or USB)
   - Open the APK on your Fire OS device to install it

### Alternative: Using Expo Go

If your Fire OS device supports the Google Play Store, you can install Expo Go and test the app directly:

1. Install Expo Go from the Google Play Store on your Fire OS device
2. Run `npx expo start` in the project directory
3. Scan the QR code with the Expo Go app on your Fire OS device

## Testing Features

The app provides a simple interface to test the following features:

1. **Check Biometric Support**: Verifies if the device has biometric hardware
2. **Check Enrollment**: Checks if biometrics are enrolled on the device
3. **Authenticate**: Attempts to authenticate using biometrics
4. **Cancel Authentication**: Cancels an ongoing authentication process

## Fire OS Compatibility Notes

- Fire OS is based on Android, but some devices may have limited biometric capabilities
- Fingerprint authentication is more likely to be supported than facial recognition
- The app logs all operations and their results for debugging purposes
- If you encounter issues, check the logs section in the app for error details

## Known Issues and Workarounds

### Potential Issues:
- Some Fire OS devices may not support biometric authentication
- Older Fire OS versions may have limited compatibility
- Fire OS may require specific permissions that are not standard in Android

### Workarounds:
- If biometric authentication fails, the app will fall back to device authentication (PIN/pattern)
- Make sure your Fire OS device has the latest system updates
- Check that biometrics are properly set up in your Fire OS device settings

## Additional Resources

- [Expo Local Authentication Documentation](https://docs.expo.dev/versions/latest/sdk/local-authentication/)
- [Fire OS Developer Portal](https://developer.amazon.com/apps-and-games/fire-os)
