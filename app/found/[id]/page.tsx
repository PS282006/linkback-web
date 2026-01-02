import { createClient } from '@supabase/supabase-js';

// 1. Setup Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 2. Define the Props Type (Next.js 15 requires params to be a Promise)
type Props = {
  params: Promise<{ id: string }>;
};

// 3. The Main Page Component
export default async function FoundItemPage({ params }: Props) {
  // AWAIT the params to get the ID (Crucial for Next.js 15)
  const { id } = await params;

  // 4. Fetch Data
  const { data: item, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  // 5. Handle "Not Found"
  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-3xl font-bold text-red-500">404: Item Not Found</h1>
        <p className="text-gray-500 mt-2">ID: {id}</p>
      </div>
    );
  }

  // 6. Check Logic
  const isLost = item.is_lost;

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
  
        <a
          href={`mailto:${item.owner_email}?subject=Found Item: ${item.name}`}
          className={`block w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
            isLost 
            ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]" 
            : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          }`}
        >
          {isLost ? "🚨 REPORT TO OWNER" : "📧 Contact Owner"}
        </a>
  
        <p className="mt-8 text-gray-500 text-xs">Protected by LinkBack Systems</p>
      </div>
    </div>
  );
}