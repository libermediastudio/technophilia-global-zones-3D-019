
import React, { useEffect, useRef } from 'react';
import { Orbit, Info, Crosshair, Plus, Minus } from 'lucide-react';
import { CelestialBodyConfig } from '../../types/index.ts';

// Custom icon for System Map: Tactical Planetary System
const SystemMapIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Orbits as dashed guides */}
    <circle cx="12" cy="12" r="10" strokeDasharray="2 4" className="opacity-30" />
    <circle cx="12" cy="12" r="6" strokeDasharray="1 3" className="opacity-50" />
    
    {/* Central Star */}
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    
    {/* Planet Nodes with connecting vector lines */}
    <g className="opacity-80">
      <line x1="12" y1="12" x2="21" y2="12" className="opacity-20" />
      <circle cx="21" cy="12" r="1.8" fill="currentColor" />
      
      <line x1="12" y1="12" x2="12" y2="6" className="opacity-20" />
      <circle cx="12" cy="6" r="1.2" fill="currentColor" />
      
      <line x1="12" y1="12" x2="6" y2="18" className="opacity-20" />
      <circle cx="6" cy="18" r="1" fill="currentColor" />
    </g>
  </svg>
);

interface SystemNavProps {
  bodies: CelestialBodyConfig[];
  currentBodyId: string;
  viewMode: 'ORBIT' | 'SYSTEM';
  zoomLevel: number;
  onSelectBody: (id: string) => void;
  onViewModeChange: (mode: 'ORBIT' | 'SYSTEM') => void;
  onZoomChange: (value: number) => void;
  onToggleInfo: () => void;
  onToggleList: () => void;
  infoVisible: boolean;
  listVisible: boolean;
  isMobile: boolean;
}

export const SystemNav: React.FC<SystemNavProps> = ({ 
  bodies, 
  currentBodyId, 
  viewMode,
  zoomLevel,
  onSelectBody, 
  onViewModeChange,
  onZoomChange,
  onToggleInfo,
  onToggleList,
  infoVisible,
  listVisible,
  isMobile
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  const targetLinkIds = ['earth', 'moon', 'mars', 'belt', 'io', 'europa', 'ganymede', 'callisto'];
  const visibleBodies = bodies.filter(b => targetLinkIds.includes(b.id));

  const adjustZoom = (delta: number) => {
    onZoomChange(Math.max(0, Math.min(100, zoomLevel + delta)));
  };

  // Auto-center active item
  useEffect(() => {
    if (activeItemRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const item = activeItemRef.current;
      
      const scrollLeft = item.offsetLeft - (container.clientWidth / 2) + (item.clientWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentBodyId]);

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] pointer-events-none flex flex-col items-center pb-6 safe-bottom">
      
      {/* Zoom & Toggles Section */}
      <div className="mb-4 pointer-events-auto flex items-center gap-2 md:gap-4 px-4 w-full max-lg justify-center">
         
         {/* Zoom Controls */}
         <div className="flex items-center gap-2 flex-1 max-w-[300px]">
            <button 
              onClick={() => adjustZoom(-5)}
              className="text-white/40 hover:text-[#E42737] transition-colors p-1"
              title="ZOOM OUT"
            >
              <Minus size={14} />
            </button>

            <div className="relative flex items-center flex-1 h-8">
                <input 
                    type="range" min="0" max="100" value={zoomLevel} 
                    onChange={(e) => onZoomChange(parseInt(e.target.value))}
                    className="w-full h-[1px] bg-white/10 appearance-none cursor-pointer focus:outline-none relative z-10
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:h-4 
                      [&::-webkit-slider-thumb]:bg-[#E42737] [&::-webkit-slider-thumb]:shadow-[0_0_8px_#E42737]
                      [&::-moz-range-thumb]:w-1 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#E42737] [&::-moz-range-thumb]:border-none
                    "
                />
            </div>

            <button 
              onClick={() => adjustZoom(5)}
              className="text-white/40 hover:text-[#E42737] transition-colors p-1"
              title="ZOOM IN"
            >
              <Plus size={14} />
            </button>
         </div>

         <span className="text-[10px] text-white/40 font-mono font-black tracking-[0.2em] w-8 text-center">{zoomLevel}%</span>
         
         <div className="flex items-center gap-3 ml-2 border-l border-white/10 pl-4">
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleInfo(); }} 
                className={`transition-all duration-300 ${infoVisible ? 'text-[#E42737] drop-shadow-[0_0_5px_rgba(228,39,55,0.5)]' : 'text-white/20 hover:text-white/50'}`}
                title="TOGGLE SYSTEM INFO"
            ><Info size={18} /></button>
            
            {viewMode === 'ORBIT' && (
              <button 
                  onClick={(e) => { e.stopPropagation(); onToggleList(); }} 
                  className={`transition-all duration-300 ${listVisible ? 'text-[#E42737] drop-shadow-[0_0_5px_rgba(228,39,55,0.5)]' : 'text-white/20 hover:text-white/50'}`}
                  title="TOGGLE TARGET LIST"
              ><Crosshair size={18} /></button>
            )}
         </div>
      </div>

      {/* Navigation Rail */}
      <div className="pointer-events-auto flex items-center border-t border-white/10 pt-4 w-full justify-center">
         <div className="flex items-center gap-3 px-4">
            <button 
                onClick={() => onViewModeChange('ORBIT')}
                className={`flex items-center justify-center w-8 md:w-auto md:px-4 h-8 border transition-all duration-300 gap-2
                  ${viewMode === 'ORBIT' 
                    ? 'bg-[#E42737] border-[#E42737] text-black shadow-[0_0_10px_rgba(228,39,55,0.4)]' 
                    : 'border-white/10 text-white/20 hover:text-white/50 hover:border-white/30'}`}
                title="ORBIT VIEW"
            >
                <Orbit size={16} />
                <span className="hidden md:inline text-[10px] font-black tracking-widest">ORBIT</span>
            </button>
            <button 
                onClick={() => onViewModeChange('SYSTEM')}
                className={`flex items-center justify-center w-8 md:w-auto md:px-4 h-8 border transition-all duration-300 gap-2
                  ${viewMode === 'SYSTEM' 
                    ? 'bg-[#E42737] border-[#E42737] text-black shadow-[0_0_10px_rgba(228,39,55,0.4)]' 
                    : 'border-white/10 text-white/20 hover:text-white/50 hover:border-white/30'}`}
                title="SYSTEM MAP"
            >
                <SystemMapIcon size={20} />
                <span className="hidden md:inline text-[10px] font-black tracking-widest">SYSTEM</span>
            </button>
         </div>

         <div className="w-[1px] h-3 bg-white/10 mx-2"></div>

         <div className="flex items-center px-4 overflow-hidden max-w-[calc(100vw-180px)] md:max-w-4xl relative">
            <div 
              ref={scrollContainerRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth"
            >
              {visibleBodies.map((body) => {
                const isActive = body.id === currentBodyId;
                const name = body.name === 'earth' ? 'TERRA' : body.name === 'moon' ? 'LUNA' : body.name;
                return (
                  <button
                    key={body.id}
                    ref={isActive ? activeItemRef : null}
                    onClick={() => onSelectBody(body.id)}
                    className={`
                      text-[10px] font-mono tracking-[0.2em] uppercase font-black whitespace-nowrap px-4 py-1.5 border transition-all duration-500
                      ${isActive 
                        ? 'text-white border-[#E42737] bg-[#E42737]/10' 
                        : 'text-white/20 border-transparent hover:text-white/60 hover:border-white/10'}
                    `}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
         </div>
      </div>
    </div>
  );
};
