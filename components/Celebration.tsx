import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const STAR_EMOJIS = ['⭐', '🌟', '✨', '💫', '🎉', '🎊'];
const STAR_COUNT = 20;

type StarConfig = {
  id: number;
  startX: number;
  delay: number;
  duration: number;
  size: number;
  emoji: string;
};

export default function Celebration() {
  const { width, height } = useWindowDimensions();

  const stars = useMemo<StarConfig[]>(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      startX: Math.random() * (width - 40),
      delay: Math.random() * 1500,
      duration: 2000 + Math.random() * 2000,
      size: 20 + Math.random() * 20,
      emoji: STAR_EMOJIS[Math.floor(Math.random() * STAR_EMOJIS.length)],
    }));
  }, [width]);

  return (
    <>
      {stars.map((star) => (
        <Star key={star.id} config={star} screenHeight={height} />
      ))}
    </>
  );
}

function Star({ config, screenHeight }: { config: StarConfig; screenHeight: number }) {
  const translateY = useSharedValue(-60);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(config.delay, withTiming(1, { duration: 200 }));
    translateY.value = withDelay(
      config.delay,
      withTiming(screenHeight + 60, {
        duration: config.duration,
        easing: Easing.in(Easing.quad),
      })
    );
    rotate.value = withDelay(
      config.delay,
      withRepeat(withTiming(360, { duration: 1500, easing: Easing.linear }), -1)
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: config.startX,
    top: 0,
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
    fontSize: config.size,
    zIndex: 100,
  }));

  return <Animated.Text style={style}>{config.emoji}</Animated.Text>;
}
