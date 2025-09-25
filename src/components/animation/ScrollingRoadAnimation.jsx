import { useEffect, useState } from "react"
import BusIcon from "@/assets/BusIcon"
import * as Trees from "./trees"

const ScrollingRoadAnimation = ({ 
  BusIcon: BusComponent = BusIcon, 
  backgroundColorTop = "bg-[#F3E5D0]/80",
  backgroundColorBottom = "bg-[#F68241]/80",
  roadColor = "bg-[#D4B5A0]",
  busPosition = "bottom-16 left-24",
  busSize = "w-24 h-24",
  busColor = "text-[#3C3C3C]",
  numberOfTrees = 6
}) => {
  const [trees, setTrees] = useState([])

  useEffect(() => {
    const treeTypes = [
      { Component: Trees.MangoTree, color: "#1F3A0F", scale: 0.8 },
      { Component: Trees.CoconutTree, color: "#2D5016", scale: 0.6 },
      { Component: Trees.OakTree, color: "#1F3A0F", scale: 0.9 },
      { Component: Trees.PalmTree, color: "#2D5016", scale: 0.5 }
    ]

    const initialTrees = Array.from({ length: numberOfTrees }).map((_, i) => {
      const randomTree = treeTypes[Math.floor(Math.random() * treeTypes.length)]
      const randomDelay = Math.random() * 15
      const randomScale = Math.random() * 0.3 + randomTree.scale
      const randomBottom = 72 + Math.random() * 8
      
      return {
        id: i,
        treeType: randomTree,
        style: {
          bottom: `${randomBottom}px`,
          animation: `scroll-left 20s linear infinite`,
          animationDelay: `${randomDelay}s`,
          transform: `scale(${randomScale})`,
          left: `100vw`,
        },
      }
    })

    setTrees(initialTrees)
  }, [numberOfTrees])

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden select-none z-0">
      {/* Background Color Layers */}
      <div className={`w-full h-1/2 ${backgroundColorTop}`}></div>
      <div className={`w-full h-1/2 ${backgroundColorBottom}`}></div>

      {/* The bus with running animation */}
      <div className={`absolute ${busPosition} ${busSize} z-10 animate-run`}>
        <BusComponent className={`fill-current ${busColor} w-full h-full`} />
      </div>

      {/* Trees */}
      {trees.map(tree => (
        <div key={tree.id} className="absolute h-16 w-12 z-5" style={tree.style}>
          <tree.treeType.Component className={`fill-current text-[${tree.treeType.color}] w-full h-full`} />
        </div>
      ))}

      {/* Subtle Distant Mountains - Less blurry */}
      <div className="absolute bottom-24 left-0 w-full h-40 opacity-50 z-0">
        <svg viewBox="0 0 1000 250" className="w-full h-full">
          {/* Far distant mountain range - subtle blur */}
          <path 
            d="M-100,250 L50,150 L200,180 L350,120 L500,150 L650,100 L800,160 L950,130 L1100,250 Z" 
            fill="url(#farMountainGradient)" 
            filter="blur(1.5px)"
          />
          {/* Middle distance mountains - very slight blur */}
          <path 
            d="M-50,250 L100,170 L250,200 L400,140 L550,170 L700,120 L850,190 L1000,150 L1150,250 Z" 
            fill="url(#midMountainGradient)" 
            filter="blur(0.8px)"
          />
          {/* Closer hills - no blur, just soft edges */}
          <path 
            d="M0,250 L120,190 L280,220 L430,160 L580,190 L730,140 L880,210 L1000,170 L1000,250 Z" 
            fill="url(#closeHillGradient)" 
          />
          <defs>
            <linearGradient id="farMountainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1A3310" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#284714" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="midMountainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1F3A0F" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2D5016" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="closeHillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2D5016" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3A6B1F" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Road */}
      <div className="absolute bottom-0 left-0 w-full h-24 z-0 overflow-hidden">
        <div 
          className={`absolute bottom-0 left-0 w-[200%] h-full ${roadColor}`}
          style={{ 
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23D4B5A0"/><path d="M0 50 Q 25 40, 50 50 T 100 50" stroke="%23B29380" stroke-width="2" fill="none"/></svg>')`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '100px 100%',
            animation: `scroll-road 10s linear infinite` 
          }}
        />
      </div>
    </div>
  )
}

export default ScrollingRoadAnimation