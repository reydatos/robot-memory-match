import { ImageSourcePropType } from 'react-native';

export type RobotConfig = {
  id: number;
  image: ImageSourcePropType | null;
  placeholderColor: string;
  emoji: string;
  name: string;
};

export const ROBOTS: RobotConfig[] = [
  { id: 0, image: null, placeholderColor: '#FF6B6B', emoji: '🤖', name: 'Bolt' },
  { id: 1, image: null, placeholderColor: '#4ECDC4', emoji: '🦾', name: 'Gizmo' },
  { id: 2, image: null, placeholderColor: '#45B7D1', emoji: '🔩', name: 'Sprocket' },
  { id: 3, image: null, placeholderColor: '#96CEB4', emoji: '⚙️', name: 'Clanky' },
  { id: 4, image: null, placeholderColor: '#FFEAA7', emoji: '🛸', name: 'Zippy' },
  { id: 5, image: null, placeholderColor: '#DDA0DD', emoji: '🚀', name: 'Rusty' },
  { id: 6, image: null, placeholderColor: '#98D8C8', emoji: '💡', name: 'Sparky' },
  { id: 7, image: null, placeholderColor: '#F7DC6F', emoji: '🔋', name: 'Buzzy' },
];

// When you have real robot images, update like:
// { id: 0, image: require('../assets/robots/robot-01.png'), ... }
