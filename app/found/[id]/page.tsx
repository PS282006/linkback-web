'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';

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
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setItem(data);
      setLoading(false);
    }
    
    fetchItem();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100">Searching...</div>;
  
  if (!item) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5 text-center">
        <h1 className="text-4xl mb-4">❌</h1>
        <h2 className="text-xl font-bold text-gray-800">Item Not Found</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        {/* Status Badge */}
        <div className="inline-block bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-bold mb-6">
          ⚠️ LOST ITEM DETECTED
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{item.name}</h1>
        <p className="text-gray-500 mb-8">This item belongs to a registered user.</p>

        {/* Action Button */}
        <a 
          href={`mailto:your-email@gmail.com?subject=Found Item: ${item.name} (ID: ${id})`}
          className="block w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition"
        >
          📧 Contact Owner Now
        </a>
      </div>
    </div>
  );
}