const BusIcon = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(50, 65) scale(1.3)">
      {/* School Bus Body */}
      <rect x="-22" y="-12" width="44" height="15" rx="3" fill="#FFD700" />
      
      {/* Bus Top */}
      <rect x="-20" y="-16" width="40" height="4" fill="#E6BE00" />
      
      {/* Windows with dividers */}
      <rect x="-18" y="-14" width="36" height="3" fill="#B3E5FC" />
      <line x1="-8" y1="-14" x2="-8" y2="-11" stroke="#333" strokeWidth="0.5" />
      <line x1="2" y1="-14" x2="2" y2="-11" stroke="#333" strokeWidth="0.5" />
      <line x1="12" y1="-14" x2="12" y2="-11" stroke="#333" strokeWidth="0.5" />
      
      {/* Side Windows */}
      <rect x="-20" y="-8" width="3" height="6" fill="#B3E5FC" />
      <rect x="17" y="-8" width="3" height="6" fill="#B3E5FC" />
      
      {/* Wheels */}
      <circle cx="-15" cy="3" r="5" fill="#333" />
      <circle cx="15" cy="3" r="5" fill="#333" />
      <circle cx="-15" cy="3" r="2.5" fill="#666" />
      <circle cx="15" cy="3" r="2.5" fill="#666" />
      
      {/* Headlights */}
      <circle cx="-21" y="-5" r="1.5" fill="#FFFFFF" />
      <circle cx="21" y="-5" r="1.5" fill="#FFFFFF" />
      
      {/* Bus stripe */}
      <rect x="-22" y="0" width="44" height="1" fill="#FF6B35" />
    </g>
  </svg>
);

export default BusIcon;