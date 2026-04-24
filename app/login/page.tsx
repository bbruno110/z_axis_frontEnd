"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const DataGhosts = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div className="absolute w-64 h-64 bg-matrix/5 blur-[100px]" animate={{ left: ['20%', '60%', '20%'], top: ['20%', '60%', '20%'] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
      <motion.div className="absolute w-40 h-40 bg-cyber/10 blur-[80px]" animate={{ right: ['10%', '50%', '10%'], bottom: ['10%', '50%', '10%'] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [terminalText, setTerminalText] = useState("");

  useEffect(() => {
    const text = "> PROTOCOLO_DE_ACESSO_REQUERIDO";
    let i = 0;
    const typing = setInterval(() => {
      setTerminalText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(typing);
    }, 50);
    return () => clearInterval(typing);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("zaxis_token", data.access_token);
        
        setStatus("success");
        setTimeout(() => {
          router.push("/terminal");
        }, 1000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Falha na comunicação com o Quartel General:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative px-6">
      <DataGhosts />
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-widest text-matrix uppercase mb-2 drop-shadow-glow-green">
            Z Axis
          </h1>
          <p className="text-cyber text-sm font-mono h-5">
            {terminalText}
            <span className="inline-block w-2 h-4 bg-cyber animate-pulse ml-1 align-middle"></span>
          </p>
        </div>

        <div className="border border-matrix bg-black/60 backdrop-blur-md p-8 relative shadow-[0_0_30px_rgba(30,255,142,0.1)]">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-matrix"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-matrix"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-matrix"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-matrix"></div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6 font-mono">
            
            <div className="flex flex-col gap-2">
              <label className="text-gray-500 text-xs tracking-widest">&gt; IDENTIFICAÇÃO (E-MAIL):</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading" || status === "success"}
                  className="w-full bg-[#111] border border-gray-700 text-white p-3 pl-8 outline-none focus:border-cyber focus:shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all disabled:opacity-50"
                  placeholder="admin@zaxis.com"
                />
                <span className="absolute left-3 top-3 text-cyber">&gt;</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-500 text-xs tracking-widest">&gt; CHAVE_DE_CRIPTOGRAFIA:</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status === "loading" || status === "success"}
                  className="w-full bg-[#111] border border-gray-700 text-matrix p-3 pl-8 outline-none focus:border-matrix focus:shadow-[0_0_10px_rgba(30,255,142,0.2)] transition-all disabled:opacity-50 tracking-[0.3em]"
                  placeholder="••••••••"
                />
                <span className="absolute left-3 top-3 text-matrix">#</span>
              </div>
            </div>

            <div className="mt-4">
              {status === "error" && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mb-4 text-center animate-pulse">
                  [!] ACESSO NEGADO. CREDENCIAIS INVÁLIDAS.
                </motion.p>
              )}
              
              {status === "success" && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-matrix text-xs mb-4 text-center animate-pulse">
                  [OK] AUTENTICAÇÃO CONFIRMADA. DESCRIPTOGRAFANDO...
                </motion.p>
              )}

              <button 
                type="submit" 
                disabled={status === "loading" || status === "success"}
                className={`w-full py-4 border font-bold tracking-widest transition-all ${
                  status === "loading" 
                    ? "border-cyber/50 text-cyber/50 cursor-not-allowed" 
                    : "border-matrix text-matrix hover:bg-matrix hover:text-black shadow-[0_0_15px_rgba(30,255,142,0.2)] hover:shadow-[0_0_25px_rgba(30,255,142,0.6)]"
                }`}
              >
                {status === "loading" ? "[ PROCESSANDO... ]" : "INICIAR_SESSÃO()"}
              </button>
            </div>

          </form>
        </div>
        <p className="text-center text-gray-600 text-[10px] mt-8 font-mono">
          SISTEMA Z-AXIS V2.0 // ACESSO RESTRITO A PESSOAL AUTORIZADO
        </p>
      </motion.div>
    </div>
  );
}