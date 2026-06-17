import React, { useState } from 'react';

interface FulfillmentSignatureCanvasProps {
  onConfirm: (sigBase64: string) => void;
  onCancel: () => void;
}

export default function FulfillmentSignatureCanvas({ onConfirm, onCancel }: FulfillmentSignatureCanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const getEventPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getEventPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getEventPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#4f46e5'; // Indigo ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    onConfirm(dataUrl);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-3.5 space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
        <span className="text-[9px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
          Capacitive Handover Inkpad
        </span>
        <button 
          onClick={clearCanvas}
          className="text-[9px] hover:underline text-slate-400 font-extrabold cursor-pointer"
        >
          Reset Inkpad
        </button>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950/40 relative">
        <canvas
          ref={canvasRef}
          width={320}
          height={100}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="w-full cursor-crosshair h-[100px] blockTouch"
        />
        <div className="absolute bottom-1 right-2 bg-slate-200/50 dark:bg-zinc-800/40 px-1 py-0.5 rounded text-[7px] font-mono text-slate-550 select-none pointer-events-none">
          TOUCH AUTHORIZATION FIELD
        </div>
      </div>

      <div className="flex gap-2 text-[9px] font-extrabold font-sans">
        <button
          onClick={onCancel}
          className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-150 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-550 dark:text-slate-400 rounded-lg text-center cursor-pointer"
        >
          Decline
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-705 text-white rounded-lg text-center cursor-pointer shadow-3xs"
        >
          Confirm Receipt Signature
        </button>
      </div>
    </div>
  );
}
