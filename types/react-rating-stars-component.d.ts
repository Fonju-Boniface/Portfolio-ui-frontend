declare module 'react-rating-stars-component' {
  import React from 'react';

  interface ReactStarsProps {
    count?: number;
    value?: number;
    onChange?: (newRating: number) => void;
    size?: number;
    activeColor?: string;
    isHalf?: boolean; // If the stars can be half
    color?: string; // Default star color
    // Add any additional props you may need based on the component's API
  }

  const ReactStars: React.FC<ReactStarsProps>;
  export default ReactStars;
}