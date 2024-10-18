export type CellType = 'wall' | 'path' | 'smallDot' | 'largeDot' | 'hole';

export type Position = {
  x: number;
  y: number;
};

export type GameState = {
  maze: CellType[][];
  playerPosition: Position;
  initialPlayerPosition: Position;
  enemies: Position[];
  initialEnemies: Position[];
  score: number;
  holeDiggingAbility: number;
  gameOver: boolean;
};

export type Direction = 'up' | 'down' | 'left' | 'right';