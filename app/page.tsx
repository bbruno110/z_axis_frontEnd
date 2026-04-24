"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Viewer360 from "@/components/Viewer360";
import FloatingCube from "@/components/FloatingCube";

type PrintItem = {
  id: string;
  name: string;
  description: string;
  time: string;
  weight: number;
  classification: string;
  subclassification: string;
  material: string;
  image_urls?: string;
};

const DataGhosts = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div className="absolute w-40 h-40 bg-cyber/15 blur-[80px]" animate={{ left: ['-10%', '80%', '80%', '-10%'], top: ['10%', '10%', '50%', '50%'] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
      <motion.div className="absolute w-64 h-64 bg-neon/10 blur-[100px]" animate={{ right: ['-10%', '40%', '40%', '-10%'], bottom: ['-10%', '-10%', '40%', '40%'] }} transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 5 }} />
      <motion.div className="absolute w-48 h-48 bg-matrix/10 blur-[90px]" animate={{ left: ['50%', '50%', '10%', '10%'], top: ['-20%', '90%', '90%', '-20%'] }} transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }} />
    </div>
  );
};

const PrintCard = ({ print }: { print: PrintItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false); 

  const fixedUrls = print.image_urls 
    ? print.image_urls.replace(/localhost/g, process.env.NEXT_PUBLIC_API_HOST || "localhost") 
    : "";

  const hasImages = fixedUrls.trim() !== "";
  const imageList = hasImages ? fixedUrls.split(",") : [];

  return (
    <>
      <motion.div 
        layoutId={`card-bg-${print.id}`} 
        className="border border-matrix relative group hover:shadow-glow-green transition-all duration-300 bg-background/80 backdrop-blur-sm flex flex-col h-full cursor-pointer z-10"
        onClick={() => setIsExpanded(true)}
      >
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-matrix"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-matrix"></div>
        <div className="w-full aspect-square relative border-b border-gray-800 bg-black overflow-hidden p-2 flex items-center justify-center">
           {hasImages && !imageError ? (
             <img 
                src={imageList[0]} 
                alt={print.name} 
                onError={() => setImageError(true)} 
                className="w-full h-full object-contain filter group-hover:brightness-110 transition-all" 
             />
           ) : (
             <FloatingCube />
           )}
           
           <div className="absolute bottom-4 right-4 bg-matrix/20 border border-matrix text-matrix w-10 h-10 flex items-center justify-center backdrop-blur-md font-bold text-xl group-hover:bg-matrix group-hover:text-black transition-colors">
             +
           </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-cyber font-bold text-lg uppercase tracking-widest truncate">
              &gt; {print.name}
            </h3>
            <p className="text-gray-500 text-xs mt-2 font-mono line-clamp-2 leading-relaxed">
              {print.description}
            </p>
          </div>
          
          <div className="text-xs space-y-2 border-t border-gray-800 pt-3 mt-4 font-mono">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">MATERIAL:</span>
              <span className="text-matrix font-bold">{print.material}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">TEMPO:</span>
              <span className="text-matrix bg-matrix/10 px-1">{print.time}</span>
            </div>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] cursor-pointer"
              onClick={() => setIsExpanded(false)}
            />

            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10 pointer-events-none">
              <motion.div
                layoutId={`card-bg-${print.id}`}
                className="bg-[#050505] border border-matrix shadow-[0_0_40px_rgba(30,255,142,0.15)] w-full max-w-6xl max-h-[95vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row pointer-events-auto relative custom-scrollbar"
              >
                 <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} exit={{ opacity: 0 }}
                    className="flex flex-col md:flex-row w-full h-full"
                 >
                   <div className="w-full md:w-1/2 bg-black border-b md:border-b-0 md:border-r border-matrix/30 p-2 md:p-8 flex flex-col relative aspect-square md:aspect-auto md:min-h-[400px]">
                      <div className="flex-1 relative w-full h-full">
                        {hasImages && !imageError ? (
                          <Viewer360 images={imageList} onLoadError={() => setImageError(true)} />
                        ) : (
                          <FloatingCube />
                        )}
                      </div>
                   </div>

                   <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col md:overflow-y-auto relative custom-scrollbar">
                      <button onClick={() => setIsExpanded(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-matrix border border-matrix w-8 h-8 flex items-center justify-center hover:bg-matrix hover:text-black transition-colors font-mono z-10">
                        X
                      </button>

                      <h3 className="text-xl md:text-3xl font-bold text-cyber uppercase mb-6 md:mb-8 tracking-widest border-b border-cyber/30 pb-4 pr-10">
                        &gt; {print.name}
                      </h3>

                      <div className="space-y-6 text-sm font-mono flex-1 pb-10 md:pb-0">
                         <div>
                           <p className="text-matrix mb-2 uppercase text-xs font-bold">&gt; STATUS_TECNICO:</p>
                           <div className="grid grid-cols-2 gap-4 bg-black/60 p-4 md:p-5 border border-gray-800">
                             <div><span className="text-gray-500 block text-[10px] mb-1">CLASSE:</span><span className="text-white">{print.classification}</span></div>
                             <div><span className="text-gray-500 block text-[10px] mb-1">SUB-CLASSE:</span><span className="text-white">{print.subclassification}</span></div>
                             <div><span className="text-gray-500 block text-[10px] mb-1">MATERIAL:</span><span className="text-matrix font-bold">{print.material}</span></div>
                             <div><span className="text-gray-500 block text-[10px] mb-1">MASSA_FINAL:</span><span className="text-white">{print.weight}g</span></div>
                             <div className="col-span-2 border-t border-gray-800 pt-2"><span className="text-gray-500 block text-[10px] mb-1">TEMPO_EXEC:</span><span className="text-matrix">{print.time}</span></div>
                           </div>
                         </div>

                         <div>
                           <p className="text-matrix mb-2 uppercase text-xs font-bold">&gt; REGISTRO_DE_FABRICACAO:</p>
                           <p className="text-gray-400 leading-relaxed bg-black/60 p-4 md:p-5 border border-gray-800 text-[11px] md:text-xs text-justify">
                             {print.description}
                           </p>
                         </div>
                      </div>
                   </div>
                 </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
export default function Home() {
  const [systemReady, setSystemReady] = useState(false);
  const [prints, setPrints] = useState<PrintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOptions, setFilterOptions] = useState({ classifications: [], subclassifications: [], materials: [] });

  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    classifications: [] as string[],
    subclassifications: [] as string[],
    materials: [] as string[],
    sortBy: "created_at",
    sortOrder: "DESC"
  });

  const BOOT_TIME_MS = 1800;
  const BOOT_TIME_S = BOOT_TIME_MS / 1000;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/prints/filters`)
      .then(res => res.json())
      .then(data => setFilterOptions(data))
      .catch(err => console.error("Falha ao buscar filtros:", err));
      
    const timer = setTimeout(() => setSystemReady(true), BOOT_TIME_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchPrints = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: "8",
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        });

        if (filters.classifications.length > 0) queryParams.append('classification', filters.classifications.join(','));
        if (filters.subclassifications.length > 0) queryParams.append('subclassification', filters.subclassifications.join(','));
        if (filters.materials.length > 0) queryParams.append('material', filters.materials.join(','));
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prints?${queryParams.toString()}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setPrints(result.data);
            setTotalPages(result.meta.lastPage);
          } else {
            setPrints(result);
          }
        }
      } catch (error) {
        console.error("Falha na conexão com o banco Z-Axis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrints();
  }, [page, filters]);

  const toggleFilter = (category: 'classifications' | 'subclassifications' | 'materials', value: string) => {
    setFilters(prev => {
      const currentList = prev[category];
      const isSelected = currentList.includes(value);
      const newList = isSelected 
        ? currentList.filter(item => item !== value)
        : [...currentList, value];
      
      return { ...prev, [category]: newList };
    });
    setPage(1);
  };

  const updateSort = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const activeFiltersCount = filters.classifications.length + filters.subclassifications.length + filters.materials.length;

  return (
    <>
      <DataGhosts />
      <div className="relative z-10 flex flex-col gap-8 mt-10 pb-20 w-full px-6 md:px-12 lg:px-24">
        
        <header className="border-l-4 border-cyber pl-6 py-4 relative min-h-[120px] flex items-center">
          {!systemReady ? (
            <div className="text-cyber text-sm md:text-base font-mono w-full">
              <motion.p 
                initial={{ width: 0 }} 
                animate={{ width: "100%" }} 
                transition={{ duration: BOOT_TIME_S * 0.3, ease: "linear" }} 
                className="overflow-hidden whitespace-nowrap border-r-4 border-cyber pr-2 inline-block"
              >
                &gt; INICIALIZANDO FIRMWARE KLIPPER...
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: BOOT_TIME_S * 0.4 }} 
                className="mt-2 text-matrix"
              >
                [OK] AQUECENDO MESA E BICO (EXT: 220°C | BED: 60°C)...
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: BOOT_TIME_S * 0.75 }} 
                className="text-matrix"
              >
                [OK] PARÂMETROS PARA FILAMENTOS CARREGADOS...
              </motion.p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-4xl md:text-6xl font-bold tracking-widest text-matrix uppercase mb-2 drop-shadow-glow-green">
                Z Axis Print
              </h1>
              <p className="text-cyber text-lg md:text-xl font-mono">
                &gt; CATÁLOGO AVANÇADO E PARÂMETROS
              </p>
            </motion.div>
          )}
        </header>
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: systemReady ? 1 : 0 }} className="flex flex-col gap-4">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-black/40 border border-gray-800 p-2 md:p-3 gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-xs md:text-sm font-bold tracking-widest border transition-all ${activeFiltersCount > 0 ? 'bg-cyber/20 border-cyber text-cyber' : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'}`}
            >
              {showFilters ? '[-] OCULTAR FILTROS' : '[+] MODO DE FILTRAGEM'}
              {activeFiltersCount > 0 && <span className="bg-cyber text-black px-2 rounded-full ml-2">{activeFiltersCount}</span>}
            </button>

            <div className="flex gap-2 w-full md:w-auto">
              <select value={filters.sortBy} onChange={(e) => updateSort('sortBy', e.target.value)} className="bg-black border border-gray-700 text-gray-400 text-xs font-mono p-2 outline-none focus:border-matrix w-full md:w-auto">
                <option value="created_at">DATA DE CRIAÇÃO</option>
                <option value="name">NOME (A-Z)</option>
                <option value="weight">MASSA (PESO)</option>
                <option value="time_minutes">TEMPO (EXECUÇÃO)</option>
              </select>
              <select value={filters.sortOrder} onChange={(e) => updateSort('sortOrder', e.target.value)} className="bg-black border border-gray-700 text-gray-400 text-xs font-mono p-2 outline-none focus:border-matrix w-full md:w-auto">
                <option value="DESC">DECRESC.</option>
                <option value="ASC">CRESC.</option>
              </select>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="bg-[#0a0a0a] border border-gray-800 p-6 overflow-hidden flex flex-col gap-6 font-mono text-xs"
              >
                <div>
                  <span className="text-gray-500 mb-3 block">&gt; CLASSES:</span>
                  <div className="flex flex-wrap gap-3">
                    {filterOptions.classifications.map((c: string) => (
                      <button key={c} onClick={() => toggleFilter('classifications', c)} className={`px-3 py-1 border transition-colors ${filters.classifications.includes(c) ? 'bg-matrix text-black border-matrix font-bold' : 'bg-black border-gray-700 text-gray-400 hover:border-matrix hover:text-matrix'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 mb-3 block">&gt; SUB-CLASSES:</span>
                  <div className="flex flex-wrap gap-3">
                    {filterOptions.subclassifications.map((c: string) => (
                      <button key={c} onClick={() => toggleFilter('subclassifications', c)} className={`px-3 py-1 border transition-colors ${filters.subclassifications.includes(c) ? 'bg-matrix text-black border-matrix font-bold' : 'bg-black border-gray-700 text-gray-400 hover:border-matrix hover:text-matrix'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 mb-3 block">&gt; MATERIAIS:</span>
                  <div className="flex flex-wrap gap-3">
                    {filterOptions.materials.map((c: string) => (
                      <button key={c} onClick={() => toggleFilter('materials', c)} className={`px-3 py-1 border transition-colors ${filters.materials.includes(c) ? 'bg-cyber text-black border-cyber font-bold' : 'bg-black border-gray-700 text-gray-400 hover:border-cyber hover:text-cyber'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button onClick={() => { setFilters({...filters, classifications: [], subclassifications: [], materials: []}); setPage(1); }} className="text-red-400 hover:text-red-300 self-start mt-2 border-b border-red-900 pb-1">
                    [X] LIMPAR TODOS OS FILTROS
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <motion.section 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: systemReady ? 1 : 0, y: systemReady ? 0 : 20 }} transition={{ delay: 0.3 }}
           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8 min-h-[400px]"
        >
          {loading ? (
            <div className="col-span-full flex items-center justify-center"><p className="text-matrix animate-pulse font-mono py-10">[ CRUZANDO DADOS... ]</p></div>
          ) : prints.length === 0 ? (
            <div className="col-span-full py-20 border border-dashed border-gray-800 text-center"><p className="text-gray-500 font-mono">&gt; SISTEMA VAZIO: NENHUMA PEÇA ENCONTRADA.</p></div>
          ) : (
            prints.map((print) => <PrintCard key={print.id} print={print} />)
          )}
        </motion.section>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-800 pt-6 mt-4 font-mono text-sm">
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="text-matrix border border-matrix/50 px-4 py-2 hover:bg-matrix hover:text-black disabled:opacity-30 disabled:hover:bg-transparent transition-all">&lt; VOLTAR</button>
            <span className="text-cyber tracking-widest text-xs md:text-sm">[ SETOR {page} DE {totalPages} ]</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="text-matrix border border-matrix/50 px-4 py-2 hover:bg-matrix hover:text-black disabled:opacity-30 disabled:hover:bg-transparent transition-all">AVANÇAR &gt;</button>
          </div>
        )}

      </div>
    </>
  );
}