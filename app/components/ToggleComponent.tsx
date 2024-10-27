"use client";
// components/ToggleComponent.js
import { useState } from 'react';

export default function ToggleComponent() {
  // Step 1: Define state to track visibility
  const [isVisible, setIsVisible] = useState(false);

  // Step 2: Function to toggle the state
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      {/* Step 3: Button to trigger toggle */}
      <button onClick={toggleVisibility}>
        {isVisible ? 'Hide' : 'Show'} Content
      </button>

      {/* Step 4: Conditionally render content */}
      {isVisible && (
        <div>
          <p>This content is toggled!</p>
          
        </div>
      )}
    </div>
  );
}
