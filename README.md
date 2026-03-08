# Robot Match by Jon Chu.

Feel free to use for all kids alike!

A memory matching card game for kids aged 6-10, built with React Native (Expo).

Flip cards to find matching robot pairs. Score points for matches, and earn bonus points for consecutive matches (streaks).

## Features

- 4x4 grid with 8 robot pairs (16 cards)
- 3D card flip animations with React Native Reanimated
- Streak-based scoring: 1 point per match, 2 points for consecutive matches
- Persistent high score tracking across sessions
- Recent game history on the win screen
- Colorful robot card backs from Unsplash
- Celebration effects when you win
- Kid-friendly UI with large touch targets

## Getting Started

```bash
npm install
npx expo start
```

Then open with:
- Expo Go on your phone (scan the QR code)
- `npx expo start --ios` for iOS simulator
- `npx expo start --android` for Android emulator
- `npx expo start --web` for browser preview

## Adding Custom Robot Images

The game ships with emoji placeholders for each robot. To use custom images:

1. Place 8 PNG files in `assets/robots/` (robot-01.png through robot-08.png)
2. Update `constants/robots.ts` to reference them:

```typescript
{ id: 0, image: require('../assets/robots/robot-01.png'), ... }
```

No other code changes needed.

## Tech Stack

- [Expo](https://expo.dev) (SDK 54) with expo-router
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for animations
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) for score persistence
- TypeScript

## Project Structure

```
app/
  _layout.tsx       Root stack navigator
  index.tsx         Home screen
  game.tsx          Game screen
  win.tsx           Win screen
components/
  Card.tsx          Flip card with animations
  GameBoard.tsx     4x4 card grid
  Celebration.tsx   Win celebration effects
hooks/
  useGameState.ts   Game logic (useReducer)
  useScores.ts      Score persistence
constants/
  theme.ts          Colors, spacing, timing
  robots.ts         Robot configurations
```
