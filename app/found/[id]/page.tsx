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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Glassmorphism Card */}
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border border-white/50 relative overflow-hidden">
        
        {/* Top Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>

        {/* Verified Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm">
            <ShieldCheck size={16} />
            SECURE REGISTERED ITEM
          </div>
        </div>

        {/* Item Name */}
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{item.name}</h1>
        <p className="text-slate-500 mb-8 font-medium">ID: {id}</p>

        {/* Message to Finder */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-left">
          <p className="text-blue-900 text-sm leading-relaxed">
            <strong>👋 To the Finder:</strong><br/>
            Thank you for scanning this.  Please help return it securely. Thank you for your honesty and cooperation!
          </p>
        </div>

        {/* Action Button */}
        <a 
          href={`mailto:${item.owner_email}?subject=Found Item: ${item.name}&body=Hello, I found your ${item.name}. Let's arrange a return.`}
          className="group block w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-3"
        >
          <Mail size={20} className="group-hover:animate-bounce" />
          Contact Owner
        </a>
        
        <p className="mt-8 text-xs text-slate-400 font-medium tracking-widest uppercase">
          Powered by LinkBack Security
        </p>
      </div>
    </div>
  );
}