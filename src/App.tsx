import React from 'react';
import GameBoard from './components/GameBoard';
import { useGameLogic } from './hooks/useGameLogic';

function App() {
  const { gameState, continueGame } = useGameLogic();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Maze Game</h1>
      <div className="mb-4">
        <p className="text-xl">Score: {gameState.score}</p>
        <p className="text-xl">Hole Digging Ability: {gameState.holeDiggingAbility}</p>
      </div>
      <GameBoard gameState={gameState} />
      {gameState.gameOver && (
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">Game Over!</div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={continueGame}
          >
            Continue
          </button>
        </div>
      )}
      <div className="mt-4 text-sm text-gray-600">
        <p>Use arrow keys to move, space to dig a hole or continue when game over</p>
      </div>
    </div>
  );
}

export default App;