"use client";
import ScrollToTopBottom from "./ScrollToTopBottom";

interface CircleProgressProps {
  percentage: number;
  circleWidth: number;
}

const CircleProgress: React.FC<CircleProgressProps> = ({ percentage, circleWidth }) => {
  const radius = 19;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  return (
    <div className="relative rounded-full flex justify-center items-center">
      <svg
        width={circleWidth}
        height={circleWidth}
        viewBox={`0 0 ${circleWidth} ${circleWidth}`}
        style={{
          background: "#010811",
          backdropFilter: "brightness(.9) blur(10px)",
          borderRadius: "100%",
        }}
      >
        <circle
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          strokeWidth="2"
          r={radius}
          className="circle-background"
          style={{
            stroke: "#586465",
          }}
        />
        <circle
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          strokeWidth="2"
          r={radius}
          className="circle-progress  stroke-primary"
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
            // stroke: '#ea0808',
          }}
          transform={`rotate(-90 ${circleWidth / 2} ${circleWidth / 2})`}
        />
      </svg>
      <ScrollToTopBottom />
    </div>
  );
};

export default CircleProgress;