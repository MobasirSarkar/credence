import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LoadingScreen({ text = 'Loading...' }: { text?: string }) {
  const [progress, setProgress] = useState(0);

  // Fake progress bar for better UX
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#2C40A7] p-6 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-xs space-y-4">
        <div className="flex justify-center mb-2">
          <Loader2 className="size-8 animate-spin text-[#F237A1]" />
        </div>
        
        {/* Loading Bar */}
        <div className="h-1.5 w-full bg-[#2C40A7]/10 rounded-full overflow-hidden border border-[#2C40A7]/20">
          <div 
            className="h-full bg-[#F237A1] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 98)}%` }}
          />
        </div>
        
        <div className="text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#2C40A7]">
            {text}
          </span>
        </div>
      </div>
    </main>
  );
}

export function LoadingState({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="p-12 w-full text-center font-mono text-xs font-bold text-[#2C40A7] flex flex-col items-center justify-center">
      <Loader2 className="size-8 animate-spin text-[#F237A1] mb-4" />
      
      <div className="w-48 h-1 bg-[#2C40A7]/10 rounded-full overflow-hidden mb-3 border border-[#2C40A7]/20 relative">
        <div className="absolute top-0 bottom-0 left-0 bg-[#F237A1] w-1/2 rounded-full animate-[progress_1s_ease-in-out_infinite_alternate]" />
      </div>
      
      {text}
    </div>
  );
}
