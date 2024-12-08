import { Snowflake } from "lucide-react";

const SnowFlakeTop = (props) => (
  <div className="relative w-full h-20">
    <svg
      width="100%"
      height="100%"
      id="svg"
      viewBox="0 0 1440 100"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-0 transition duration-300 ease-in-out delay-150"
      preserveAspectRatio="none"
      {...props}
    >
      <defs>
        <linearGradient id="gradient" x1="21%" y1="90%" x2="79%" y2="10%">
          <stop offset="5%" stopColor="#f8f8f8" />
          <stop offset="95%" stopColor="#d5f2e3" />
        </linearGradient>
      </defs>
      
      {/* Single wave */}
      <path
        d="M0 0V60C240 40 480 20 720 30C960 40 1200 80 1440 100V0Z"
        fill="url(#gradient)"
      >
        <animate
          attributeName="d"
          dur="10s"
          repeatCount="indefinite"
          values="
            M0 0V60C240 40 480 20 720 30C960 40 1200 80 1440 100V0Z;
            M0 0V80C240 60 480 40 720 50C960 60 1200 100 1440 120V0Z;
            M0 0V60C240 40 480 20 720 30C960 40 1200 80 1440 100V0Z"
        />
      </path>
    </svg>
    
    {/* Snow decoration */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <Snowflake
          key={i}
          className="absolute text-gray-300 opacity-50"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 10}px`,
            animation: `fall ${Math.random() * 10 + 5}s linear infinite`,
          }}
        />
      ))}
    </div>
  </div>
);

export default SnowFlakeTop;