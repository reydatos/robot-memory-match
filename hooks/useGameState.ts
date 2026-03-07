import { useReducer, useEffect, useRef, useCallback } from 'react';
import { CARD } from '@/constants/theme';

export type CardData = {
  id: number;
  robotId: number;
  isFlipped: boolean;
  isMatched: boolean;
};

export type GameState = {
  cards: CardData[];
  firstPick: number | null;
  secondPick: number | null;
  score: number;
  moves: number;
  streak: number;
  isChecking: boolean;
  matchedPairs: number;
};

type GameAction =
  | { type: 'FLIP_CARD'; index: number }
  | { type: 'CHECK_MATCH' }
  | { type: 'RESET' };

function createShuffledDeck(): CardData[] {
  const pairs = Array.from({ length: 8 }, (_, i) => i);
  const deck = [...pairs, ...pairs];
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.map((robotId, index) => ({
    id: index,
    robotId,
    isFlipped: false,
    isMatched: false,
  }));
}

function createInitialState(): GameState {
  return {
    cards: createShuffledDeck(),
    firstPick: null,
    secondPick: null,
    score: 0,
    moves: 0,
    streak: 0,
    isChecking: false,
    matchedPairs: 0,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'FLIP_CARD': {
      const { index } = action;
      const card = state.cards[index];

      // Ignore if checking, already flipped, or already matched
      if (state.isChecking || card.isFlipped || card.isMatched) {
        return state;
      }

      const updatedCards = state.cards.map((c, i) =>
        i === index ? { ...c, isFlipped: true } : c
      );

      if (state.firstPick === null) {
        return { ...state, cards: updatedCards, firstPick: index };
      }

      // Second pick
      return {
        ...state,
        cards: updatedCards,
        secondPick: index,
        isChecking: true,
      };
    }

    case 'CHECK_MATCH': {
      if (state.firstPick === null || state.secondPick === null) return state;

      const first = state.cards[state.firstPick];
      const second = state.cards[state.secondPick];
      const isMatch = first.robotId === second.robotId;

      if (isMatch) {
        const points = state.streak > 0 ? 2 : 1;
        return {
          ...state,
          cards: state.cards.map((c) =>
            c.id === first.id || c.id === second.id
              ? { ...c, isMatched: true }
              : c
          ),
          score: state.score + points,
          streak: state.streak + 1,
          moves: state.moves + 1,
          matchedPairs: state.matchedPairs + 1,
          firstPick: null,
          secondPick: null,
          isChecking: false,
        };
      }

      // Mismatch
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === first.id || c.id === second.id
            ? { ...c, isFlipped: false }
            : c
        ),
        streak: 0,
        moves: state.moves + 1,
        firstPick: null,
        secondPick: null,
        isChecking: false,
      };
    }

    case 'RESET':
      return createInitialState();

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (state.secondPick !== null && state.isChecking) {
      checkTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'CHECK_MATCH' });
      }, CARD.checkDelay);
    }
    return () => {
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    };
  }, [state.secondPick, state.isChecking]);

  const flipCard = useCallback((index: number) => {
    dispatch({ type: 'FLIP_CARD', index });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return { state, flipCard, reset };
}
