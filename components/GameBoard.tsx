import React from 'react';
import { FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import Card from '@/components/Card';
import { CardData } from '@/hooks/useGameState';
import { SPACING } from '@/constants/theme';

type GameBoardProps = {
  cards: CardData[];
  onFlipCard: (index: number) => void;
};

export default function GameBoard({ cards, onFlipCard }: GameBoardProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const boardWidth = screenWidth - SPACING.boardPadding * 2;
  const cardFromWidth = (boardWidth - SPACING.cardGap * 3) / 4;
  // Reserve ~160px for header + pairs row + safe areas
  const availableHeight = screenHeight - 160;
  const cardFromHeight = (availableHeight - SPACING.cardGap * 3) / 4;
  const cardSize = Math.min(cardFromWidth, cardFromHeight);

  return (
    <FlatList
      data={cards}
      numColumns={4}
      scrollEnabled={false}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={[styles.board, { paddingHorizontal: SPACING.boardPadding }]}
      columnWrapperStyle={{ gap: SPACING.cardGap }}
      ItemSeparatorComponent={() => <>{/* gap handled by style */}</>}
      renderItem={({ item, index }) => (
        <Card
          robotId={item.robotId}
          isFlipped={item.isFlipped}
          isMatched={item.isMatched}
          onPress={() => onFlipCard(index)}
          size={cardSize}
        />
      )}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  board: {
    gap: SPACING.cardGap,
  },
});
