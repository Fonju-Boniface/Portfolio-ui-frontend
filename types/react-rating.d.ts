declare module 'react-rating' {
    import { Component } from 'react';
  
    interface RatingProps {
      initialRating?: number;
      onChange?: (newRating: number) => void;
      emptySymbol?: React.ReactNode;
      fullSymbol?: React.ReactNode;
      readonly?: boolean;
      className?: string;
    }
  
    export default class Rating extends Component<RatingProps> {}
  }
  