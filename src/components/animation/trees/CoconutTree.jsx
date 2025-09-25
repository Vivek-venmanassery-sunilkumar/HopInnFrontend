// components/animations/trees/CoconutTree.jsx
const CoconutTree = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50 10 Q55 5 60 15 Q65 25 55 30 Q50 35 45 30 Q35 25 40 15 Q45 5 50 10" fill="#2D5016" />
    <path d="M50 30 Q52 40 48 50 Q50 60 52 70 Q48 80 50 90" stroke="#8B4513" strokeWidth="3" fill="none" />
    <rect x="48" y="90" width="4" height="10" fill="#8B4513" />
    {/* Coconuts */}
    <circle cx="45" cy="20" r="3" fill="#8B4513" />
    <circle cx="55" cy="25" r="3" fill="#8B4513" />
  </svg>
);

export default CoconutTree;