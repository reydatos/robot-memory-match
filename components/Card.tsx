import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { COLORS, CARD } from '@/constants/theme';
import { ROBOTS } from '@/constants/robots';

const CARD_BACK_IMAGE = require('../assets/robots/card-back.png');

type CardProps = {
  robotId: number;
  isFlipped: boolean;
  isMatched: boolean;
  onPress: () => void;
  size: number;
};

export default function Card({ robotId, isFlipped, isMatched, onPress, size }: CardProps) {
  const rotation = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const prevFlipped = useRef(isFlipped);
  const robot = ROBOTS[robotId];

  useEffect(() => {
    rotation.value = withTiming(isFlipped || isMatched ? 180 : 0, {
      duration: CARD.flipDuration,
    });
  }, [isFlipped, isMatched]);

  // Detect mismatch (was flipped, now unflipped, not matched)
  useEffect(() => {
    if (prevFlipped.current && !isFlipped && !isMatched) {
      shakeX.value = withSequence(
        withTiming(8, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withSpring(0, { damping: 50, stiffness: 500 }),
      );
    }
    prevFlipped.current = isFlipped;
  }, [isFlipped, isMatched]);

  // Match glow
  useEffect(() => {
    if (isMatched) {
      glowOpacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0.4, { duration: 500 }),
      );
    }
  }, [isMatched]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg` },
    ],
    backfaceVisibility: 'hidden' as const,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(rotation.value, [0, 180], [180, 360])}deg` },
    ],
    backfaceVisibility: 'hidden' as const,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    borderColor: COLORS.matchGlow,
    borderWidth: interpolate(glowOpacity.value, [0, 1], [0, 3]),
    shadowColor: COLORS.matchGlow,
    shadowOpacity: glowOpacity.value * 0.8,
    shadowRadius: interpolate(glowOpacity.value, [0, 1], [0, 12]),
    shadowOffset: { width: 0, height: 0 },
  }));

  return (
    <Animated.View style={[containerStyle, { width: size, height: size }]}>
      <Pressable
        onPress={onPress}
        disabled={isMatched}
        style={{ width: size, height: size }}
      >
        <Animated.View style={[glowStyle, styles.cardContainer, { width: size, height: size, borderRadius: 12 }]}>
          {/* Front face (card back - decorative image) */}
          <Animated.View style={[styles.face, styles.frontFace, frontStyle, { borderRadius: 12 }]}>
            <Image
              source={CARD_BACK_IMAGE}
              style={styles.cardBackImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Back face (robot reveal) */}
          <Animated.View style={[styles.face, styles.backFace, backStyle, { borderRadius: 12 }]}>
            <Image source={robot.image} style={styles.robotImage} resizeMode="contain" />
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  frontFace: {
    backgroundColor: COLORS.cardBack,
    zIndex: 1,
  },
  backFace: {
    backgroundColor: COLORS.cardFront,
  },
  cardBackImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  robotImage: {
    width: '85%',
    height: '85%',
  },
});
