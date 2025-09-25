// components/animations/trees/MangoTree.jsx
const MangoTree = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="30" r="25" fill="#2D5016" />
    <rect x="47" y="55" width="6" height="35" fill="#8B4513" />
    {/* Mango fruits */}
    <circle cx="40" cy="25" r="4" fill="#FF6B35" />
    <circle cx="55" cy="30" r="4" fill="#FF6B35" />
    <circle cx="45" cy="35" r="4" fill="#FF6B35" />
  </svg>
);

export default MangoTree;