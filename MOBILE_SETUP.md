# Vestra Mobile — Play Store + App Store Setup

> Run these once. After that `npm run build && npx cap sync` is your repeating cycle.

## 0. Prereqs

- Android: Android Studio + JDK 17
- iOS: macOS + Xcode 15+
- Capacitor config already at `capacitor.config.ts` (this repo)

## 1. Install Capacitor + plugins

```bash
cd /home/davie/WebstormProjects/vestra_properties

# Core + platforms
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android

# Plugins for Vestra features
npm install @capacitor/splash-screen
npm install @capacitor/status-bar
npm install @capacitor/keyboard
npm install @capacitor/push-notifications     # rent reminders, invite alerts
npm install @capacitor/local-notifications    # offline rent due reminders
npm install @capacitor/camera                 # property + maintenance photos
npm install @capacitor/geolocation            # map filter, suburb detection
npm install @capacitor/share                  # share listing to WhatsApp
npm install @capacitor/preferences            # secure local cache
npm install @capacitor/app                    # back-button handling
npm install @capacitor/network                # offline detection
npm install @capacitor-community/biometric-auth  # login + STK confirm
```

## 2. Initialize native projects

```bash
npm run build
npx cap add ios
npx cap add android
npx cap sync
```

## 3. Open in native IDEs

```bash
npx cap open ios       # Xcode
npx cap open android   # Android Studio
```

In Xcode: set Team + Bundle Identifier (`com.vestra.app`), enable Push Notifications capability.
In Android Studio: configure signing key (`keytool -genkey -v -keystore vestra.keystore -alias vestra -keyalg RSA -keysize 2048 -validity 10000`).

## 4. Runtime API base URL

In production builds, `VITE_API_URL` must point at the **deployed** backend (not localhost). Build via:

```bash
VITE_API_URL=https://api.vestra.com npm run build
npx cap sync
```

## 5. App icons + splash

Place 1024×1024 icon at `resources/icon.png` and 2732×2732 splash at `resources/splash.png`, then:

```bash
npm install -D @capacitor/assets
npx capacitor-assets generate
```

## 6. Run on device

```bash
npx cap run ios       # iOS simulator
npx cap run android   # Android emulator or attached device
```

## 7. Store submission

### Apple App Store
1. Apple Developer Account ($99 / yr).
2. Create app in App Store Connect — name `Vestra: Real Estate, Unified`, bundle id `com.vestra.app`.
3. App Privacy questionnaire: declare PII (name, email, phone), Financial Info (M-Pesa refs), Location (optional).
4. Upload via Xcode → Product → Archive → Distribute.
5. TestFlight beta with 25+ Kenya testers for ~7 days before production.
6. Review: 24–72 hr typical.

### Google Play
1. Play Console ($25 one-off).
2. Internal testing track first → closed testing → production.
3. Closed testing: 20+ testers × 14 days minimum.
4. Build signed AAB:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   Output: `android/app/build/outputs/bundle/release/app-release.aab`
5. Upload AAB, content rating questionnaire, data safety declaration.
6. Review: ~14 days closed-track.

## 8. M-Pesa landmine

Apple may flag the in-app M-Pesa payment as a financial product. Mitigation:

- Position as "third-party payment integration" in App Privacy notes.
- Surface Safaricom Daraja branding clearly.
- Include T&Cs link in payment screens.
- Have a fallback "Pay via bank transfer" option (already shipped).

## 9. Realistic timeline

| Week | Milestone |
|---|---|
| 1–2 | Capacitor wrap + native plugin integration + dev builds |
| 3–4 | Internal testing (Vestra team) |
| 5 | TestFlight + Play closed testing |
| 6–7 | Store listings, screenshots, privacy policy publishing |
| 8 | Submit; Apple ~3 days, Play ~14 days |

**Public launch: ~10 weeks from start of mobile work.**

## 10. After-launch OTA updates

```bash
npm run build && npx cap sync
```

For true OTA (JS/CSS-only without resubmission) use `@capacitor/live-updates` (Ionic Appflow / Capgo).
