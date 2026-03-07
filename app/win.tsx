import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import Celebration from '@/components/Celebration';
import { useScores } from '@/hooks/useScores';
import { COLORS } from '@/constants/theme';

export default function WinScreen() {
  const { score, moves } = useLocalSearchParams<{ score: string; moves: string }>();
  const { highScore, recentScores, saveScore, loaded } = useScores();
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [saved, setSaved] = useState(false);

  const badgeScale = useSharedValue(0);
  const badgeRotate = useSharedValue(-10);

  useEffect(() => {
    if (!loaded || saved) return;
    const numScore = Number(score) || 0;
    const numMoves = Number(moves) || 0;
    saveScore(numScore, numMoves).then((newHigh) => {
      setIsNewHigh(newHigh);
      setSaved(true);
      if (newHigh) {
        badgeScale.value = withDelay(
          300,
          withSpring(1, { damping: 8, stiffness: 200 }),
        );
        badgeRotate.value = withDelay(
          300,
          withRepeat(
            withSequence(
              withTiming(6, { duration: 300 }),
              withTiming(-6, { duration: 300 }),
            ),
            3,
            true,
          ),
        );
      }
    });
  }, [loaded]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: badgeScale.value },
      { rotate: `${badgeRotate.value}deg` },
    ],
  }));

  // Previous high to show (before this game's score was saved)
  const previousHigh = isNewHigh
    ? recentScores.length > 1 ? recentScores[1].score : 0
    : highScore;

  return (
    <SafeAreaView style={styles.container}>
      <Celebration />

      <View style={styles.content}>
        <Text style={styles.youWin}>YOU WIN!</Text>

        {isNewHigh && (
          <Animated.View style={[styles.newHighBadge, badgeStyle]}>
            <Text style={styles.newHighText}>NEW HIGH SCORE!</Text>
          </Animated.View>
        )}

        <View style={[styles.scoreCard, isNewHigh && styles.scoreCardHighlight]}>
          <Text style={styles.scoreLabel}>FINAL SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.movesText}>
            All 8 pairs in {moves} moves!
          </Text>
          {!isNewHigh && previousHigh > 0 && (
            <Text style={styles.highScoreRef}>
              High Score: {previousHigh}
            </Text>
          )}
        </View>

        {/* Recent scores */}
        {recentScores.length > 1 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>RECENT GAMES</Text>
            {recentScores.slice(0, 5).map((entry, i) => (
              <View key={entry.date} style={styles.historyRow}>
                <Text style={[
                  styles.historyScore,
                  i === 0 && styles.historyCurrentGame,
                ]}>
                  {entry.score} pts
                </Text>
                <Text style={styles.historyMoves}>{entry.moves} moves</Text>
                {entry.score === highScore && (
                  <Text style={styles.historyBest}>BEST</Text>
                )}
              </View>
            ))}
          </View>
        )}

        <Pressable
          style={styles.playAgainButton}
          onPress={() => router.replace('/game')}
        >
          <Text style={styles.playAgainText}>PLAY AGAIN</Text>
        </Pressable>

        <Pressable
          style={styles.homeLink}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.homeLinkText}>Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    zIndex: 50,
  },
  youWin: {
    fontSize: 56,
    fontWeight: '900',
    color: COLORS.accent,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
  },
  newHighBadge: {
    backgroundColor: COLORS.streakBadge,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    shadowColor: COLORS.streakBadge,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  newHighText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
  },
  scoreCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    paddingHorizontal: 40,
    paddingVertical: 28,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  scoreCardHighlight: {
    borderColor: COLORS.accent,
    borderWidth: 2,
    backgroundColor: 'rgba(255,215,0,0.08)',
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.accent,
    marginTop: 4,
  },
  movesText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontWeight: '600',
  },
  highScoreRef: {
    fontSize: 13,
    color: COLORS.accent,
    marginTop: 10,
    fontWeight: '700',
    opacity: 0.7,
  },
  historySection: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 3,
  },
  historyScore: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    width: 60,
    textAlign: 'right',
  },
  historyCurrentGame: {
    color: COLORS.accent,
  },
  historyMoves: {
    fontSize: 14,
    color: COLORS.textSecondary,
    width: 70,
  },
  historyBest: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.accent,
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  playAgainButton: {
    marginTop: 24,
    backgroundColor: COLORS.buttonPrimary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: COLORS.buttonPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  playAgainText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.buttonText,
    letterSpacing: 3,
  },
  homeLink: {
    marginTop: 16,
    padding: 8,
  },
  homeLinkText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
