import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useGameState } from '@/hooks/useGameState';
import { useScores } from '@/hooks/useScores';
import GameBoard from '@/components/GameBoard';
import { COLORS, SPACING } from '@/constants/theme';

export default function GameScreen() {
  const { state, flipCard, reset } = useGameState();
  const { highScore } = useScores();
  const streakScale = useSharedValue(1);

  // Animate streak badge on change
  useEffect(() => {
    if (state.streak > 0) {
      streakScale.value = withSpring(1.3, { damping: 8, stiffness: 300 }, () => {
        streakScale.value = withSpring(1);
      });
    }
  }, [state.streak]);

  // Navigate to win screen
  useEffect(() => {
    if (state.matchedPairs === 8) {
      const timeout = setTimeout(() => {
        router.replace(`/win?score=${state.score}&moves=${state.moves}`);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [state.matchedPairs]);

  const streakStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakScale.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Score Header */}
      <View style={styles.header}>
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.statValue}>{state.score}</Text>
          </View>

          {state.streak > 0 && (
            <Animated.View style={[styles.streakBadge, streakStyle]}>
              <Text style={styles.streakText}>🔥 x{state.streak + 1}</Text>
            </Animated.View>
          )}

          <View style={styles.stat}>
            <Text style={styles.statLabel}>MOVES</Text>
            <Text style={styles.statValue}>{state.moves}</Text>
          </View>

          {highScore > 0 && (
            <View style={styles.highScoreStat}>
              <Text style={styles.statLabel}>BEST</Text>
              <Text style={[
                styles.statValue,
                styles.highScoreText,
                state.score > highScore && styles.beatingHighScore,
              ]}>
                {highScore}
              </Text>
            </View>
          )}
        </View>

        <Pressable onPress={reset} style={styles.resetButton}>
          <Text style={styles.resetText}>↻</Text>
        </Pressable>
      </View>

      {/* Game Board */}
      <View style={styles.boardContainer}>
        <GameBoard cards={state.cards} onFlipCard={flipCard} />
      </View>

      {/* Pairs found indicator */}
      <View style={styles.pairsRow}>
        {Array.from({ length: 8 }, (_, i) => (
          <View
            key={i}
            style={[
              styles.pairDot,
              i < state.matchedPairs && styles.pairDotActive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: 12,
  },
  statRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.accent,
  },
  streakBadge: {
    backgroundColor: COLORS.streakBadge,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  highScoreStat: {
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 8,
  },
  highScoreText: {
    fontSize: 20,
    color: COLORS.textSecondary,
    opacity: 0.6,
  },
  beatingHighScore: {
    color: COLORS.matchGlow,
    opacity: 1,
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    fontSize: 22,
    color: COLORS.textSecondary,
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  pairsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 20,
  },
  pairDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  pairDotActive: {
    backgroundColor: COLORS.matchGlow,
  },
});
