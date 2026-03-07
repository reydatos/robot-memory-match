import { ImageSourcePropType } from 'react-native';

export type RobotConfig = {
  id: number;
  image: ImageSourcePropType;
  name: string;
};

export const ROBOTS: RobotConfig[] = [
  { id: 0, image: require('../assets/robots/robot-01.png'), name: 'Bolt' },
  { id: 1, image: require('../assets/robots/robot-02.png'), name: 'Gizmo' },
  { id: 2, image: require('../assets/robots/robot-03.png'), name: 'Sprocket' },
  { id: 3, image: require('../assets/robots/robot-04.png'), name: 'Clanky' },
  { id: 4, image: require('../assets/robots/robot-05.png'), name: 'Zippy' },
  { id: 5, image: require('../assets/robots/robot-06.png'), name: 'Rusty' },
  { id: 6, image: require('../assets/robots/robot-07.png'), name: 'Sparky' },
  { id: 7, image: require('../assets/robots/robot-08.png'), name: 'Buzzy' },
];
