import Viewer360 from './Viewer360';
import FloatingCube from './FloatingCube';

export default function PrintCard({ print }: { print: any }) {
const hasImages = print.image_urls && print.image_urls.trim() !== '';
const imageList = hasImages ? print.image_urls.split(',') : [];

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 p-4 rounded-xl hover:border-matrix transition-all">
      {hasImages ? (
        <Viewer360 images={imageList} />
      ) : (
        <FloatingCube />
      )}

      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-bold uppercase tracking-tighter">{print.name}</h3>
          <span className="text-[10px] bg-matrix/20 text-matrix px-2 py-0.5 rounded border border-matrix/30">
            {print.classification}
          </span>
        </div>
        
        <p className="text-gray-500 text-xs line-clamp-2">{print.description}</p>
        
        <div className="flex gap-4 pt-2 border-t border-gray-800/50">
          <div className="text-[10px]">
            <span className="text-gray-600 block uppercase">Tempo</span>
            <span className="text-matrix font-mono">{print.time}</span>
          </div>
          <div className="text-[10px]">
            <span className="text-gray-600 block uppercase">Peso</span>
            <span className="text-matrix font-mono">{print.weight}g</span>
          </div>
        </div>
      </div>
    </div>
  );
}