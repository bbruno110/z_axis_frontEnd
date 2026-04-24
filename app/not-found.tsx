"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, Home } from "lucide-react";

// --- ANIMAÇÃO DE FUNDO (Glitch Matrix) ---
const DataGhosts = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div className="absolute w-64 h-64 bg-red-900/10 blur-[100px]" animate={{ left: ['10%', '80%', '10%'], top: ['20%', '50%', '20%'] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
      <motion.div className="absolute w-40 h-40 bg-matrix/5 blur-[80px]" animate={{ right: ['20%', '50%', '20%'], bottom: ['10%', '60%', '10%'] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
    </div>
  );
};

export default function NotFound() {
  const [text, setText] = useState("");
  const fullText = "> PROTOCOLO 404: SETOR INEXISTENTE OU CORROMPIDO.";

  // Efeito de digitação no terminal
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(typing);
    }, 50);
    return () => clearInterval(typing);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative px-6 font-mono overflow-hidden">
      <DataGhosts />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        
        {/* Ícone de Alerta Piscante */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.5, 1, 0.5], scale: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
        >
          <AlertTriangle size={80} strokeWidth={1} />
        </motion.div>

        {/* O GLITCH DO 404 */}
        <div className="relative mb-4">
          <motion.h1 
            animate={{ x: [-2, 2, -2, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
            className="text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gray-700 to-gray-900 select-none"
          >
            404
          </motion.h1>
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3.1 }}
            className="absolute inset-0 text-7xl md:text-9xl font-bold text-red-500 blur-[2px] select-none"
          >
            404
          </motion.div>
          <div className="absolute inset-0 text-7xl md:text-9xl font-bold text-matrix opacity-20 select-none">
            404
          </div>
        </div>

        {/* Texto do Terminal */}
        <div className="h-12 mb-8">
          <p className="text-red-400 text-sm md:text-base font-bold tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
            {text}
            <span className="inline-block w-2 h-4 bg-red-500 animate-pulse ml-1 align-middle"></span>
          </p>
          <p className="text-gray-600 text-[10px] md:text-xs mt-2 uppercase">
            A requisição foi interceptada e bloqueada pelo firewall Z-Axis.
          </p>
        </div>

        {/* Botão de Retorno */}
        <Link href="/">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative border border-matrix bg-black/50 px-8 py-4 flex items-center gap-3 overflow-hidden transition-all hover:bg-matrix hover:text-black shadow-[0_0_20px_rgba(30,255,142,0.1)] hover:shadow-[0_0_30px_rgba(30,255,142,0.4)]"
          >
            <Home size={18} className="text-matrix group-hover:text-black transition-colors" />
            <span className="text-matrix group-hover:text-black font-bold tracking-widest uppercase text-xs md:text-sm transition-colors">
              RETORNAR À BASE
            </span>
            
            {/* Efeito de Scanline no hover */}
            <div className="absolute inset-0 w-full h-[2px] bg-white/50 -translate-y-full group-hover:animate-scanline opacity-0 group-hover:opacity-100"></div>
          </motion.button>
        </Link>
        
      </div>

      {/* Linhas de grade decorativas ao fundo */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(30,255,142,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,255,142,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
    </div>
  );
}