// components/animations/trees/PalmTree.jsx
const PalmTree = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Palm leaves */}
    <path d="M50 15 L70 10 L65 25 L50 20 Z" fill="#2D5016" />
    <path d="M50 15 L30 10 L35 25 L50 20 Z" fill="#2D5016" />
    <path d="M50 20 L75 30 L70 45 L50 35 Z" fill="#1F3A0F" />
    <path d="M50 20 L25 30 L30 45 L50 35 Z" fill="#1F3A0F" />
    {/* Trunk */}
    <rect x="48" y="45" width="4" height="45" fill="#8B4513" />
  </svg>
);

export default PalmTree;