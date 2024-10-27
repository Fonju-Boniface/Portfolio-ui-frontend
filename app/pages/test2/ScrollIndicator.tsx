// components/ScrollIndicator.tsx
import { useEffect, useState } from 'react';

const ScrollIndicator = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const totalHeight = documentHeight - windowHeight;
      const percentage = Math.round((scrollY / totalHeight) * 100);

      setScrollPercentage(percentage);
      setIsAtTop(scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="absolute inset-0" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="lightgray"
            strokeWidth="10"
            fill="none"
            className="transition-all duration-300 ease-in-out"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="blue"
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${scrollPercentage * 2.83} ${282.6}`}
            style={{ transition: 'stroke-dasharray 0.3s ease-in-out' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-bold text-xl text-blue-600">
          {scrollPercentage}%
        </span>
      </div>
      {isAtTop ? (
        <button
          onClick={scrollToBottom}
          className="mt-4 bg-blue-500 text-white rounded p-2 shadow hover:bg-blue-600 transition duration-300"
        >
          Scroll to Bottom
        </button>
      ) : (
        <button
          onClick={scrollToTop}
          className="mt-4 bg-blue-500 text-white rounded p-2 shadow hover:bg-blue-600 transition duration-300"
        >
          Scroll to Top
        </button>
      )}
    </div>
  );
};

export default ScrollIndicator;
