'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';
import { ShieldCheck, AlertTriangle, Mail } from 'lucide-react';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FoundItemPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    async function fetchItem() {
      const { data } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setItem(data);
      setLoading(false);
    }
    fetchItem();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400">
      <div className="animate-pulse flex flex-col items-center">
        <ShieldCheck size={48} className="mb-4" />
        <p>Verifying Item ID...</p>
      </div>
    </div>
  );
  
  if (!item) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-5 text-center">
        <AlertTriangle size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Invalid QR Code</h2>
        <p className="text-slate-500 mt-2">This ID does not exist in our secure registry.</p>
    </div>
  );
  const isLost = item?.is_lost;
  return (
  <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${
    isLost ? "bg-red-900" : "bg-gradient-to-br from-gray-900 via-purple-900 to-black"
  }`}>
    
    <div className={`backdrop-blur-xl p-8 rounded-2xl shadow-2xl border max-w-md w-full text-center ${
       isLost ? "bg-red-950/80 border-red-500" : "bg-white/10 border-white/20"
    }`}>
      
      {/* Dynamic Header */}
      {isLost ? (
        <div className="animate-pulse mb-6">
          <h1 className="text-4xl font-extrabold text-red-500 tracking-widest uppercase">⚠️ LOST ITEM ⚠️</h1>
          <p className="text-red-200 mt-2">This item has been reported stolen or lost.</p>
        </div>
      ) : (
        <h1 className="text-3xl font-bold text-white mb-2">Item Found! 🎉</h1>
      )}

      {/* Image Display */}
      {item.image_url && (
        <img 
          src={item.image_url} 
          alt="Item" 
          className={`w-full h-64 object-cover rounded-lg mb-6 border-2 ${isLost ? "border-red-500" : "border-white/20"}`}
        />
      )}

      <h2 className="text-2xl font-semibold text-white mb-4">{item.name}</h2>
      
      <div className="bg-black/30 p-4 rounded-lg mb-6">
        <p className="text-gray-400 text-sm uppercase tracking-wide">Owner Contact</p>
        <p className="text-cyan-400 text-lg font-mono mt-1">{item.owner_email || "Hidden"}</p>
      </div>

      <button
        onClick={() => window.location.href = `mailto:${item.owner_email}?subject=Found Item: ${item.name}`}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
          isLost 
          ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]" 
          : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]"
        }`}
      >
        {isLost ? "🚨 REPORT TO OWNER" : "📧 Contact Owner"}
      </button>

      <p className="mt-8 text-gray-500 text-xs">Protected by LinkBack Systems</p>
    </div>
  </div>
);
}