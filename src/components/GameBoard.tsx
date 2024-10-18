import React from 'react';
import { GameState, Position } from '../types';
import Cell from './Cell';
import Player from './Player';
import Enemy from './Enemy';

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { maze, playerPosition, enemies } = gameState;

  const renderCell = (x: number, y: number) => {
    const cellType = maze[y][x];
    const key = `${x}-${y}`;

    if (x === playerPosition.x && y === playerPosition.y) {
      return (
        <div key={key} className="relative">
          <Cell type={cellType} />
          <div className="absolute top-0 left-0">
            <Player />
          </div>
        </div>
      );
    }

    const enemy = enemies.find((e) => e.x === x && e.y === y);
    if (enemy) {
      return (
        <div key={key} className="relative">
          <Cell type={cellType} />
          <div className="absolute top-0 left-0">
            <Enemy />
          </div>
        </div>
      );
    }

    return <Cell key={key} type={cellType} />;
  };

  return (
    <div className="grid grid-cols-20 gap-0">
      {maze.map((row, y) =>
        row.map((_, x) => renderCell(x, y))
      )}
    </div>
  );
};

export default GameBoard;