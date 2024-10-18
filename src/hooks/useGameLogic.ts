import { useState, useEffect, useCallback } from 'react';
import { GameState, Position, Direction } from '../types';
import { generateMaze, getRandomEmptyPosition, isValidMove } from '../utils/mazeGenerator';

const ENEMY_COUNT = 5;

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const maze = generateMaze();
    const playerPosition = getRandomEmptyPosition(maze);
    const enemies = Array(ENEMY_COUNT).fill(null).map(() => getRandomEmptyPosition(maze));
    return {
      maze,
      playerPosition,
      initialPlayerPosition: playerPosition,
      enemies,
      initialEnemies: enemies,
      score: 0,
      holeDiggingAbility: 0,
      gameOver: false,
    };
  });

  const movePlayer = useCallback((direction: Direction) => {
    if (gameState.gameOver) return;

    setGameState((prevState) => {
      const newPosition: Position = { ...prevState.playerPosition };

      switch (direction) {
        case 'up':
          newPosition.y -= 1;
          break;
        case 'down':
          newPosition.y += 1;
          break;
        case 'left':
          newPosition.x -= 1;
          break;
        case 'right':
          newPosition.x += 1;
          break;
      }

      if (!isValidMove(prevState.maze, newPosition)) {
        return prevState;
      }

      const newMaze = prevState.maze.map(row => [...row]);
      let newScore = prevState.score;
      let newHoleDiggingAbility = prevState.holeDiggingAbility;

      const currentCell = newMaze[newPosition.y][newPosition.x];
      if (currentCell === 'smallDot') {
        newScore += 1;
        newMaze[newPosition.y][newPosition.x] = 'path';
      } else if (currentCell === 'largeDot') {
        newHoleDiggingAbility += 1;
        newMaze[newPosition.y][newPosition.x] = 'path';
      } else if (currentCell === 'hole') {
        return { ...prevState, gameOver: true };
      }

      return {
        ...prevState,
        maze: newMaze,
        playerPosition: newPosition,
        score: newScore,
        holeDiggingAbility: newHoleDiggingAbility,
      };
    });
  }, [gameState.gameOver]);

  const digHole = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameOver || prevState.holeDiggingAbility === 0) return prevState;

      const newMaze = prevState.maze.map(row => [...row]);
      const { x, y } = prevState.playerPosition;

      if (newMaze[y][x] === 'path') {
        newMaze[y][x] = 'hole';
        return {
          ...prevState,
          maze: newMaze,
          holeDiggingAbility: prevState.holeDiggingAbility - 1,
        };
      }

      return prevState;
    });
  }, []);

  const moveEnemies = useCallback(() => {
    if (gameState.gameOver) return;

    setGameState((prevState) => {
      const newEnemies = prevState.enemies.map((enemy) => {
        const directions: Direction[] = ['up', 'down', 'left', 'right'];
        const validMoves = directions
          .map((dir) => {
            const newPos = { ...enemy };
            switch (dir) {
              case 'up':
                newPos.y -= 1;
                break;
              case 'down':
                newPos.y += 1;
                break;
              case 'left':
                newPos.x -= 1;
                break;
              case 'right':
                newPos.x += 1;
                break;
            }
            return isValidMove(prevState.maze, newPos) ? newPos : null;
          })
          .filter((pos): pos is Position => pos !== null);

        if (validMoves.length === 0) return enemy;

        const newPosition = validMoves[Math.floor(Math.random() * validMoves.length)];

        if (prevState.maze[newPosition.y][newPosition.x] === 'hole') {
          return getRandomEmptyPosition(prevState.maze);
        }

        return newPosition;
      });

      const playerCaught = newEnemies.some(
        (enemy) => enemy.x === prevState.playerPosition.x && enemy.y === prevState.playerPosition.y
      );

      return {
        ...prevState,
        enemies: newEnemies,
        gameOver: playerCaught,
      };
    });
  }, [gameState.gameOver]);

  const continueGame = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      playerPosition: prevState.initialPlayerPosition,
      enemies: prevState.initialEnemies,
      gameOver: false,
      holeDiggingAbility: 0,
    }));
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          movePlayer('up');
          break;
        case 'ArrowDown':
          movePlayer('down');
          break;
        case 'ArrowLeft':
          movePlayer('left');
          break;
        case 'ArrowRight':
          movePlayer('right');
          break;
        case ' ':
          if (gameState.gameOver) {
            continueGame();
          } else {
            digHole();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    const enemyMoveInterval = setInterval(moveEnemies, 500);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(enemyMoveInterval);
    };
  }, [movePlayer, digHole, moveEnemies, gameState.gameOver, continueGame]);

  return { gameState, movePlayer, digHole, continueGame };
}