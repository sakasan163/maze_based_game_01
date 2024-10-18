import { CellType, Position } from '../types';

const MAZE_SIZE = 20;
const SMALL_DOT_PROBABILITY = 0.3;
const LARGE_DOT_COUNT = 5;

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function generateMaze(): CellType[][] {
  const maze: CellType[][] = Array(MAZE_SIZE).fill(null).map(() =>
    Array(MAZE_SIZE).fill('wall')
  );

  const stack: Position[] = [];
  const start: Position = { x: 1, y: 1 };
  maze[start.y][start.x] = 'path';
  stack.push(start);

  const directions = [
    { dx: 0, dy: -2 }, // Up
    { dx: 2, dy: 0 },  // Right
    { dx: 0, dy: 2 },  // Down
    { dx: -2, dy: 0 }, // Left
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const unvisitedNeighbors = shuffleArray(directions)
      .map(dir => ({ x: current.x + dir.dx, y: current.y + dir.dy }))
      .filter(pos => 
        pos.x > 0 && pos.x < MAZE_SIZE - 1 && 
        pos.y > 0 && pos.y < MAZE_SIZE - 1 && 
        maze[pos.y][pos.x] === 'wall'
      );

    if (unvisitedNeighbors.length > 0) {
      const next = unvisitedNeighbors[0];
      maze[next.y][next.x] = 'path';
      maze[current.y + (next.y - current.y) / 2][current.x + (next.x - current.x) / 2] = 'path';
      stack.push(next);
    } else {
      stack.pop();
    }
  }

  // Add small dots
  for (let y = 0; y < MAZE_SIZE; y++) {
    for (let x = 0; x < MAZE_SIZE; x++) {
      if (maze[y][x] === 'path' && Math.random() < SMALL_DOT_PROBABILITY) {
        maze[y][x] = 'smallDot';
      }
    }
  }

  // Add large dots
  for (let i = 0; i < LARGE_DOT_COUNT; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * MAZE_SIZE);
      y = Math.floor(Math.random() * MAZE_SIZE);
    } while (maze[y][x] !== 'path');
    maze[y][x] = 'largeDot';
  }

  return maze;
}

export function getRandomEmptyPosition(maze: CellType[][]): Position {
  let x, y;
  do {
    x = Math.floor(Math.random() * MAZE_SIZE);
    y = Math.floor(Math.random() * MAZE_SIZE);
  } while (maze[y][x] !== 'path');
  return { x, y };
}

export function isValidMove(maze: CellType[][], position: Position): boolean {
  return (
    position.x >= 0 &&
    position.x < MAZE_SIZE &&
    position.y >= 0 &&
    position.y < MAZE_SIZE &&
    maze[position.y][position.x] !== 'wall'
  );
}