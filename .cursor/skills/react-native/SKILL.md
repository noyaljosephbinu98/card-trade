---
name: react-native
description: React Native conventions covering navigation, platform APIs, list performance, native module selection, deep linking, and iOS/Android build troubleshooting. Use when building or debugging anything that runs on iOS or Android simulators or devices, or when touching native config (Info.plist, AndroidManifest.xml, Podfile, gradle).
---

# React Native

## List performance (the #1 RN perf issue)

`FlatList` (not `ScrollView.map`) for any list > ~10 items. Required props:

```tsx
<FlatList
  data={items}
  keyExtractor={item => item.id}           // stable, unique
  renderItem={renderItem}                  // useCallback, memoized row
  getItemLayout={(_, i) => ({ length: ROW_H, offset: ROW_H * i, index: i })}
  initialNumToRender={8}
  maxToRenderPerBatch={8}
  windowSize={5}
  removeClippedSubviews                    // Android especially
/>
```

- Rows = `React.memo` with primitive/stable props only.
- Fixed row height whenever possible → enables `getItemLayout` → unlocks scroll-to-index and smooth FPS.
- Keep `renderItem` defined outside the list component or stabilize with `useCallback`.

## Navigation (react-navigation)

- Stacks for screen flows, tabs for top-level nav.
- **Typed param lists** per navigator; augment `ReactNavigation.RootParamList` once.
- `useNavigation<NativeStackScreenProps<ParamList, 'Screen'>['navigation']>()` — always typed.
- Linking config lives in one file (`src/app/linking.ts`), screens stay ignorant of URL structure.

## Deep linking

1. Register a scheme in both platforms:
   - **iOS**: `Info.plist` → `CFBundleURLTypes` → `CFBundleURLSchemes`.
   - **Android**: `AndroidManifest.xml` → `<intent-filter>` with `<data android:scheme="..." />`.
2. Define `linking` config mapping URLs → navigator state.
3. **Auth-gate**: if a deep link arrives while logged out, stash it (`pendingLink` store) and replay after login.
4. Test:
   - iOS: `xcrun simctl openurl booted "myapp://path?q=x"`
   - Android: `adb shell am start -W -a android.intent.action.VIEW -d "myapp://path?q=x"`

## Storage

- `@react-native-async-storage/async-storage` for JSON-serializable data.
- `react-native-keychain` / `react-native-encrypted-storage` for secrets (tokens, passwords).
- For Zustand persistence: pass `createJSONStorage(() => AsyncStorage)`; provide custom `serialize`/`deserialize` for `Set`, `Map`, `Date`.

## Images

- Native `<Image />` is fine for small, local, or short-list images.
- `react-native-fast-image` for large remote lists (disk cache, priority, `cache: 'immutable'`).
- Always provide `width` + `height` (or `aspectRatio`) to avoid layout thrash.

## Native module selection

Before adding a native dep, ask:

1. Does it support the New Architecture (Fabric / TurboModules)?
2. Is it maintained (commits in last 6 months)?
3. Does it autolink or require manual Podfile / gradle edits?
4. Is there a managed-Expo-compatible alternative if the project might move to Expo?

Prefer **core RN APIs** first (`Modal`, `Image`, `Pressable`), **well-maintained community modules** second, **forked/custom native code** only as last resort.

## Platform differences

```tsx
import { Platform } from 'react-native';

const shadow = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  android: { elevation: 2 },
});
```

- Use `Platform.OS` for branching, `Platform.select` for value maps.
- `.ios.tsx` / `.android.tsx` file extensions for larger divergence.
- Safe area: `react-native-safe-area-context` (`useSafeAreaInsets`), not the deprecated `SafeAreaView` from `react-native` on iOS.

## Build troubleshooting

| Symptom | Fix |
|---|---|
| `Unable to resolve module ...` | `rm -rf node_modules && npm i && npx react-native start --reset-cache` |
| iOS build fails after native dep install | `cd ios && pod install && cd ..` |
| Pod install errors on M-series Mac | `arch -x86_64 pod install` or update CocoaPods |
| Android `.gradle` weirdness | `cd android && ./gradlew clean && cd ..` |
| White screen on launch | Check Metro is running, check Hermes is enabled, check for JS error in device logs |
| Deep link doesn't open app | Reinstall app after `Info.plist` / `AndroidManifest.xml` change |

## Hermes

- On by default in RN 0.70+. Verify at runtime: `global.HermesInternal != null`.
- Enables faster startup, smaller binaries. Worth confirming in Release builds.

## In this project (AltLite)

- Lists: `src/features/listings/components/ListingList.tsx`.
- Deep link scheme: `myalt://` — `ios/AltLite/Info.plist`, `android/app/src/main/AndroidManifest.xml`.
- Linking config: `src/app/linking.ts`; pending-link store: `src/app/pendingLink.ts`.
- Simulator commands: see `README.md` "Deep linking" section.
