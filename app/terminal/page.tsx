"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Viewer360 from "@/components/Viewer360";
import FloatingCube from "@/components/FloatingCube";
import { Trash2, Edit3, Plus, Power, GripHorizontal, ChevronLeft, ChevronRight, LogOut } from "lucide-react";

type PrintItem = {
  id: string;
  name: string;
  description: string;
  time: string;
  weight: number | string;
  classification: string;
  subclassification: string;
  material: string;
  image_urls: string;
  isActive?: boolean;
};

const SafeThumbnail = ({ src }: { src: string }) => {
  const [error, setError] = useState(false);
  if (!src || error) return <div className="w-full h-full flex items-center justify-center scale-50"><FloatingCube /></div>;
  return <img src={src} onError={() => setError(true)} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />;
};

export default function TerminalPage() {
  const router = useRouter();
  const [prints, setPrints] = useState<PrintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState({ classifications: [], subclassifications: [], materials: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    classifications: [] as string[],
    subclassifications: [] as string[],
    materials: [] as string[],
    sortBy: "created_at",
    sortOrder: "DESC"
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PrintItem>({
    id: "", name: "", description: "", time: "", weight: "", classification: "", subclassification: "", material: "", image_urls: ""
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("zaxis_token");
    if (!storedToken) {
      router.replace("/login");
      return;
    }
    setToken(storedToken);
    setIsVerifying(false);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/prints/filters`)
      .then(res => res.json())
      .then(data => setFilterOptions(data))
      .catch(err => console.error("Falha ao buscar filtros:", err));
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchPrints = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: "6", 
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          isAdmin: "true" 
        });

        if (filters.classifications.length > 0) queryParams.append('classification', filters.classifications.join(','));
        if (filters.subclassifications.length > 0) queryParams.append('subclassification', filters.subclassifications.join(','));
        if (filters.materials.length > 0) queryParams.append('material', filters.materials.join(','));

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prints?${queryParams.toString()}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setPrints(result.data.map((p: any) => ({ ...p, isActive: p.isActive !== false })));
            setTotalPages(result.meta.lastPage);
          } else {
            setPrints(result.map((p: any) => ({ ...p, isActive: p.isActive !== false })));
          }
        }
      } catch (err) { console.error("Erro:", err); } finally { setLoading(false); }
    };

    fetchPrints();
  }, [page, filters, token]);

  const refreshCurrentPage = () => { setPage(prev => prev); };

  const toggleFilter = (category: 'classifications' | 'subclassifications' | 'materials', value: string) => {
    setFilters(prev => {
      const currentList = prev[category];
      const isSelected = currentList.includes(value);
      const newList = isSelected ? currentList.filter(item => item !== value) : [...currentList, value];
      return { ...prev, [category]: newList };
    });
    setPage(1);
  };
  const updateSort = (key: string, value: string) => { setFilters(prev => ({ ...prev, [key]: value })); setPage(1); };
  const activeFiltersCount = filters.classifications.length + filters.subclassifications.length + filters.materials.length;

  const handleLogout = () => {
    localStorage.removeItem("zaxis_token"); 
    router.push("/"); 
  };

  const handleDragStart = (e: React.DragEvent, index: number) => { setDraggedIdx(index); e.dataTransfer.effectAllowed = "move"; };
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) return;
    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];
    const [draggedFile] = newFiles.splice(draggedIdx, 1);
    const [draggedPreview] = newPreviews.splice(draggedIdx, 1);
    newFiles.splice(targetIndex, 0, draggedFile);
    newPreviews.splice(targetIndex, 0, draggedPreview);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    setDraggedIdx(null);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };
  const removePreview = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleEdit = (print: PrintItem) => {
    setFormData({ ...print });
    setEditId(print.id);
    if (print.image_urls) {
      const currentHost = process.env.NEXT_PUBLIC_API_HOST || "localhost";
      setPreviews(print.image_urls.split(',').map(url => url.replace(/localhost/g, currentHost)));
    } else { setPreviews([]); }
    setSelectedFiles([]);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsAdding(false); setEditId(null); setPreviews([]); setSelectedFiles([]);
    setFormData({ id: "", name: "", description: "", time: "", weight: "", classification: "", subclassification: "", material: "", image_urls: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'image_urls' && key !== 'id' && value !== undefined) data.append(key, String(value));
    });

    const currentHost = process.env.NEXT_PUBLIC_API_HOST || "localhost";
    const regexHost = new RegExp(currentHost, 'g');
    const existingUrls = previews.filter(p => !p.startsWith('blob:')).map(url => url.replace(regexHost, 'localhost')).join(',');
    
    data.append('image_urls', existingUrls);
    selectedFiles.forEach(file => data.append('files', file));

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = editId ? `${baseUrl}/prints/${editId}` : `${baseUrl}/prints`;

    try {
      const res = await fetch(url, { method: editId ? "PATCH" : "POST", headers: { "Authorization": `Bearer ${token}` }, body: data });
      if (res.ok) { resetForm(); setPage(1); } 
    } catch (err) { alert("Falha na transmissão."); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("> CONFIRMAR EXCLUSÃO PERMANENTE? O ARQUIVO SERÁ DESINTEGRADO.")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prints/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
    refreshCurrentPage();
  };

  const toggleActive = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prints/${id}/toggle`, { method: "PATCH", headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setPrints(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    } catch (err) { console.error("Erro ao inativar:", err); }
  };

  if (isVerifying) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><p className="text-matrix font-mono animate-pulse tracking-widest text-sm">[ VERIFICANDO CREDENCIAIS... ]</p></div>;

  const publicPrints = prints.filter(p => p.isActive);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono p-6 md:p-12 pb-24">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-matrix/30 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-matrix uppercase tracking-tighter">&gt; TERMINAL_DE_CONTROLE</h1>
          <p className="text-gray-500 text-[10px] md:text-xs mt-1">USUÁRIO: BRUNO_OLIVEIRA // SISTEMA: Z-AXIS V2.0</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <button onClick={() => isAdding ? resetForm() : setIsAdding(true)} className="bg-matrix text-black px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-cyber transition-all w-full md:w-auto justify-center">
            <Plus size={18} /> {isAdding ? "CANCELAR" : "NOVA_IMPRESSÃO"}
          </button>
          
          <button onClick={handleLogout} className="border border-red-900 text-red-500 hover:bg-red-900 hover:text-white px-4 py-2 md:py-3 text-xs md:text-sm font-bold flex items-center gap-2 transition-all w-full md:w-auto justify-center">
            <LogOut size={18} /> SAIR
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-black/60 border border-cyber p-6 md:p-8 mb-12 overflow-hidden">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h2 className="text-cyber border-b border-cyber/20 pb-2 mb-4 uppercase text-sm font-bold">{editId ? "[ EDIÇÃO_DE_DADOS ]" : "[ ENTRADA_DE_DADOS ]"}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="text-[10px] text-gray-500">NOME_DO_MODELO:</label><input required className="w-full bg-black border border-gray-800 p-3 outline-none focus:border-matrix" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                  <div><label className="text-[10px] text-gray-500">CLASSE:</label><input required className="w-full bg-black border border-gray-800 p-3 outline-none focus:border-matrix" value={formData.classification} onChange={e => setFormData({...formData, classification: e.target.value})} /></div>
                  <div><label className="text-[10px] text-gray-500">SUB-CLASSE:</label><input className="w-full bg-black border border-gray-800 p-3 outline-none focus:border-matrix" value={formData.subclassification} onChange={e => setFormData({...formData, subclassification: e.target.value})} /></div>
                  <div><label className="text-[10px] text-gray-500">MASSA FINAL (g):</label><input type="number" required className="w-full bg-black border border-gray-800 p-3 outline-none focus:border-matrix" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} /></div>
                  <div><label className="text-[10px] text-gray-500">MATERIAL:</label><input type="text" required className="w-full bg-black border border-gray-800 p-3 outline-none focus:border-matrix" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value.toUpperCase()})} placeholder="Ex: PLA, TPU..." /></div>
                  <div className="col-span-2"><label className="text-[10px] text-gray-500">TEMPO_DE_EXECUÇÃO (Ex: 6h 40m):</label><input required className="w-full bg-black border border-gray-800 p-3 outline-none focus:border-matrix" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} /></div>
                </div>
                <div><label className="text-[10px] text-gray-500">DESCRIÇÃO:</label><textarea rows={4} required className="w-full bg-black border border-gray-800 p-3 outline-none focus:border-matrix" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                <button type="submit" className="w-full py-4 bg-matrix/20 border border-matrix text-matrix hover:bg-matrix hover:text-black font-bold tracking-widest transition-all">{editId ? "SALVAR_ALTERAÇÕES()" : "TRANSMITIR_PARA_O_BANCO()"}</button>
              </div>
              <div className="space-y-6">
                <h2 className="text-cyber border-b border-cyber/20 pb-2 mb-4 uppercase text-sm font-bold">[ INSPEÇÃO_DE_MÍDIA ]</h2>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="block w-full border-2 border-dashed border-gray-800 p-6 text-center cursor-pointer hover:border-matrix text-gray-400 hover:text-matrix transition-colors">[+] INJETAR FRAMES FOTOGRÁFICOS</label>
                <div className="grid grid-cols-4 gap-2">
                  {previews.map((src, idx) => (
                    <div key={idx} draggable onDragStart={(e) => handleDragStart(e, idx)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, idx)} className={`relative aspect-square border ${draggedIdx === idx ? 'border-cyber opacity-50' : 'border-gray-800'} bg-black group cursor-grab active:cursor-grabbing`}>
                      <img src={src} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
                        <GripHorizontal className="text-matrix mb-1" size={20} />
                        <button type="button" onClick={() => removePreview(idx)} className="text-red-500 bg-red-500/20 p-1 rounded"><Trash2 size={14}/></button>
                      </div>
                      <span className="absolute top-1 left-1 text-[8px] bg-black/80 px-1 text-matrix">F_{idx+1}</span>
                    </div>
                  ))}
                </div>
                {previews.length > 0 && (
                  <div className="border border-matrix/30 bg-black aspect-video relative flex flex-col">
                    <div className="flex-1 overflow-hidden"><Viewer360 images={previews} /></div>
                    <p className="bg-matrix/10 text-[10px] p-2 text-matrix text-center uppercase tracking-widest animate-pulse">[ SIMULAÇÃO_ATIVA ]</p>
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-black/40 border border-gray-800 p-2 md:p-3 gap-4">
        <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold tracking-widest border transition-all ${activeFiltersCount > 0 ? 'bg-cyber/20 border-cyber text-cyber' : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'}`}>
          {showFilters ? '[-] OCULTAR FILTROS' : '[+] MODO DE FILTRAGEM'}
          {activeFiltersCount > 0 && <span className="bg-cyber text-black px-2 rounded-full ml-2">{activeFiltersCount}</span>}
        </button>
        <div className="flex gap-2 w-full md:w-auto">
          <select value={filters.sortBy} onChange={(e) => updateSort('sortBy', e.target.value)} className="bg-black border border-gray-700 text-gray-400 text-xs font-mono p-2 outline-none focus:border-matrix w-full md:w-auto">
            <option value="created_at">DATA DE CRIAÇÃO</option><option value="name">NOME (A-Z)</option><option value="weight">MASSA (PESO)</option><option value="time_minutes">TEMPO (EXECUÇÃO)</option>
          </select>
          <select value={filters.sortOrder} onChange={(e) => updateSort('sortOrder', e.target.value)} className="bg-black border border-gray-700 text-gray-400 text-xs font-mono p-2 outline-none focus:border-matrix w-full md:w-auto">
            <option value="DESC">DECRESC.</option><option value="ASC">CRESC.</option>
          </select>
        </div>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-[#0a0a0a] border border-gray-800 p-6 mb-6 overflow-hidden flex flex-col gap-4 font-mono text-xs">
            <div><span className="text-gray-500 mb-2 block">&gt; CLASSES:</span><div className="flex flex-wrap gap-2">{filterOptions.classifications.map((c: string) => <button key={c} onClick={() => toggleFilter('classifications', c)} className={`px-2 py-1 border ${filters.classifications.includes(c) ? 'bg-matrix text-black border-matrix' : 'bg-black border-gray-700 text-gray-400 hover:border-matrix hover:text-matrix'}`}>{c}</button>)}</div></div>
            <div><span className="text-gray-500 mb-2 block">&gt; MATERIAIS:</span><div className="flex flex-wrap gap-2">{filterOptions.materials.map((c: string) => <button key={c} onClick={() => toggleFilter('materials', c)} className={`px-2 py-1 border ${filters.materials.includes(c) ? 'bg-cyber text-black border-cyber' : 'bg-black border-gray-700 text-gray-400 hover:border-cyber hover:text-cyber'}`}>{c}</button>)}</div></div>
            {activeFiltersCount > 0 && <button onClick={() => { setFilters({...filters, classifications: [], subclassifications: [], materials: []}); setPage(1); }} className="text-red-400 self-start mt-2 border-b border-red-900">[X] LIMPAR FILTROS</button>}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
    
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-matrix mb-4 flex items-center gap-2 uppercase font-bold text-sm md:text-base">&gt; REGISTROS_ATIVOS_NO_BANCO:</h2>
          {loading ? ( <p className="animate-pulse text-matrix font-mono text-sm">[ SINCRONIZANDO... ]</p>
          ) : prints.length === 0 ? ( <p className="text-gray-500 font-mono text-sm border border-dashed border-gray-800 p-6 text-center">NENHUMA PEÇA ATENDE AOS CRITÉRIOS.</p>
          ) : prints.map(print => {
            const currentHost = process.env.NEXT_PUBLIC_API_HOST || "localhost";
            const firstImage = print.image_urls ? print.image_urls.split(',')[0].replace(/localhost/g, currentHost) : "";
            
            return (
              <div key={print.id} className={`flex flex-col md:flex-row items-start md:items-center justify-between border ${print.isActive ? 'border-gray-800 bg-black/40 hover:border-matrix/50' : 'border-red-900/50 bg-red-900/10 opacity-60'} p-4 transition-all group gap-4`}>
                <div className="flex items-center gap-4 w-full">
                  <div className="w-16 h-16 bg-black border border-gray-800 flex items-center justify-center overflow-hidden shrink-0"><SafeThumbnail src={firstImage} /></div>
                  <div>
                    <h3 className="text-cyber font-bold uppercase text-sm md:text-base line-clamp-1">{!print.isActive && <span className="text-red-500 mr-2">[INATIVO]</span>} {print.name}</h3>
                    <p className="text-[10px] text-gray-500 uppercase mt-1">CLASSE: {print.classification} // MAT: {print.material} // TEMPO: {print.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button onClick={() => handleEdit(print)} className="p-2 border border-gray-800 text-gray-400 hover:border-matrix hover:text-matrix transition-all" title="Editar"><Edit3 size={16}/></button>
                  <button onClick={() => toggleActive(print.id)} className={`p-2 border border-gray-800 transition-all ${print.isActive ? 'text-gray-400 hover:border-cyber hover:text-cyber' : 'text-cyber border-cyber bg-cyber/10'}`} title="Alternar Visibilidade"><Power size={16}/></button>
                  <button onClick={() => handleDelete(print.id)} className="p-2 border border-gray-800 text-gray-400 hover:border-red-500 hover:text-red-500 transition-all" title="Excluir Permanentemente"><Trash2 size={16}/></button>
                </div>
              </div>
            )
          })}

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-4 font-mono text-sm">
              <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="flex items-center gap-1 text-matrix px-3 py-1 hover:bg-matrix/20 disabled:opacity-30 disabled:hover:bg-transparent"><ChevronLeft size={16}/> VOLTAR</button>
              <span className="text-gray-500 text-xs">[ PÁGINA {page} DE {totalPages} ]</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="flex items-center gap-1 text-matrix px-3 py-1 hover:bg-matrix/20 disabled:opacity-30 disabled:hover:bg-transparent">AVANÇAR <ChevronRight size={16}/></button>
            </div>
          )}
        </div>
        <div className="xl:col-span-1 sticky top-6">
           <h2 className="text-cyber mb-4 flex items-center gap-2 uppercase font-bold text-sm md:text-base">[ SIMULADOR DA HOME ]</h2>
           
           <div className="border border-gray-800 rounded-lg bg-[#050505] overflow-hidden shadow-2xl flex flex-col h-[500px]">
              <div className="bg-[#111] border-b border-gray-800 p-2 flex items-center gap-3">
                 <div className="flex gap-1.5 ml-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                 </div>
                 <div className="bg-black border border-gray-800 text-gray-500 text-[9px] px-3 py-1 rounded w-full text-center font-mono flex-1 mr-4">
                    https://{process.env.NEXT_PUBLIC_API_HOST || "localhost"}:3000
                 </div>
              </div>

              <div className="p-3 overflow-y-auto custom-scrollbar flex-1 relative">
                 <div className="border-l-2 border-cyber pl-2 mb-3 mt-1">
                    <h1 className="text-matrix text-xs font-bold tracking-widest uppercase">Z Axis Print</h1>
                    <p className="text-cyber text-[8px]">PORTFÓLIO E ESPECIFICAÇÕES</p>
                 </div>
                 
                 <div className="flex gap-2 border-b border-gray-800 pb-2 mb-3 overflow-x-hidden whitespace-nowrap opacity-50">
                   <span className="text-cyber border-b border-cyber text-[8px] pb-1">/TUDO</span>
                   <span className="text-gray-500 text-[8px]">/RPG</span>
                   <span className="text-gray-500 text-[8px]">/PEÇAS</span>
                 </div>

                 <div className="grid grid-cols-2 gap-2">
                    {publicPrints.length === 0 ? (
                       <p className="text-gray-600 text-[9px] col-span-2 text-center my-10">VAZIO.</p>
                    ) : (
                       publicPrints.map(p => {
                         const currentHost = process.env.NEXT_PUBLIC_API_HOST || "localhost";
                         const img = p.image_urls ? p.image_urls.split(',')[0].replace(/localhost/g, currentHost) : "";
                         
                         return (
                           <div key={p.id} className="border border-matrix/50 bg-black aspect-square flex flex-col group relative">
                             <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-matrix"></div>
                             <div className="flex-1 overflow-hidden p-1 flex items-center justify-center">
                               <SafeThumbnail src={img} />
                             </div>
                             <div className="p-1 border-t border-gray-800">
                               <p className="text-[7px] text-cyber truncate uppercase font-bold">&gt; {p.name}</p>
                             </div>
                           </div>
                         )
                       })
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}