import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useScores } from '@/hooks/useScores';
import { COLORS } from '@/constants/theme';

const FLOATING_ROBOTS = [
  { emoji: '🤖', x: '10%', top: 120, delay: 0 },
  { emoji: '🦾', x: '75%', top: 160, delay: 300 },
  { emoji: '⚙️', x: '20%', top: 280, delay: 600 },
  { emoji: '🔩', x: '70%', top: 320, delay: 200 },
  { emoji: '🛸', x: '45%', top: 100, delay: 500 },
];

export default function HomeScreen() {
  const { highScore, loaded } = useScores();

  return (
    <View style={styles.container}>
      {FLOATING_ROBOTS.map((robot, i) => (
        <FloatingEmoji key={i} emoji={robot.emoji} x={robot.x} top={robot.top} delay={robot.delay} />
      ))}

      <View style={styles.content}>
        <Text style={styles.title}>ROBOT{'\n'}MATCH</Text>
        <Text style={styles.subtitle}>Find all the robot pairs!</Text>

        {loaded && highScore > 0 && (
          <View style={styles.highScoreBadge}>
            <Text style={styles.highScoreLabel}>HIGH SCORE</Text>
            <Text style={styles.highScoreValue}>{highScore}</Text>
          </View>
        )}

        <Pressable style={styles.playButton} onPress={() => router.push('/game')}>
          <Text style={styles.playText}>PLAY</Text>
        </Pressable>
      </View>
    </View>
  );
}

function FloatingEmoji({ emoji, x, top, delay }: { emoji: string; x: string; top: number; delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-12, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(12, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Text
      style={[
        { position: 'absolute', left: x as any, top, fontSize: 40, opacity: 0.3 },
        style,
      ]}
    >
      {emoji}
    </Animated.Text>
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
  },
  title: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.accent,
    textAlign: 'center',
    lineHeight: 72,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontSize: 20,
    color: COLORS.textSecondary,
    marginTop: 16,
    fontWeight: '600',
  },
  playButton: {
    marginTop: 48,
    backgroundColor: COLORS.buttonPrimary,
    paddingHorizontal: 64,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: COLORS.buttonPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  playText: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.buttonText,
    letterSpacing: 4,
  },
  highScoreBadge: {
    marginTop: 28,
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
  },
  highScoreLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  highScoreValue: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.accent,
  },
});
