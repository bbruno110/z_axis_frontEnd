'use client';

export default function FloatingCube() {
  return (
    <div className="w-full aspect-square bg-[#0a0a0a] flex items-center justify-center overflow-hidden rounded-lg border border-gray-900 group">
      <div className="w-20 h-20 perspective-[1000px]">
        <div className="w-full h-full relative transform-style-3d animate-rotate-slow">
          <div className="absolute w-full h-full border border-matrix/50 bg-matrix/5 transform-style-3d backface-hidden">
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-matrix font-mono opacity-50">ZAXIS</span>
          </div>
          <div className="absolute w-full h-full border border-matrix/40 bg-matrix/5 translate-z-[40px]" />
          <div className="absolute w-full h-full border border-matrix/30 bg-matrix/5 rotate-y-180 translate-z-[40px]" />
          <div className="absolute w-full h-full border border-matrix/30 bg-matrix/10 rotate-y-90 translate-z-[40px]" />
          <div className="absolute w-full h-full border border-matrix/30 bg-matrix/10 rotate-y--90 translate-z-[40px]" />
          <div className="absolute w-full h-full border border-matrix/20 bg-matrix/5 rotate-x-90 translate-z-[40px]" />
          <div className="absolute w-full h-full border border-matrix/20 bg-matrix/5 rotate-x--90 translate-z-[40px] shadow-[0_80px_60px_-15px_rgba(30,255,142,0.2)]" />
        </div>
      </div>
      <div className="absolute bottom-3 text-center text-[9px] text-gray-700 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
        Processando Sequência 360
      </div>
    </div>
  );
}