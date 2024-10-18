import React from 'react';
import { CellType } from '../types';
import { Circle } from 'lucide-react';

interface CellProps {
  type: CellType;
}

const Cell: React.FC<CellProps> = ({ type }) => {
  switch (type) {
    case 'wall':
      return <div className="bg-gray-800 w-6 h-6" />;
    case 'path':
      return <div className="bg-gray-200 w-6 h-6" />;
    case 'smallDot':
      return (
        <div className="bg-gray-200 w-6 h-6 flex items-center justify-center">
          <Circle className="text-yellow-500" size={8} />
        </div>
      );
    case 'largeDot':
      return (
        <div className="bg-gray-200 w-6 h-6 flex items-center justify-center">
          <Circle className="text-yellow-500" size={16} />
        </div>
      );
    case 'hole':
      return (
        <div className="bg-gray-200 w-6 h-6 flex items-center justify-center">
          <Circle className="text-black" fill="black" size={20} />
        </div>
      );
    default:
      return <div className="bg-gray-200 w-6 h-6" />;
  }
};

export default Cell;