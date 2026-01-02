import { createClient } from '@supabase/supabase-js';

// 🛑 THIS LINE FIXES THE 404 ISSUE:
export const dynamic = 'force-dynamic'; 

// 1. Setup Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 2. Main Page
export default async function FoundItemPage({ params }) {
  // Await params (Next.js 15 fix)
  const { id } = await params;

  // 3. Fetch Data
  const { data: item, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  // 4. Handle "Not Found"
  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 text-center">
        <div>
           <h1 className="text-4xl font-bold text-red-600 mb-2">404</h1>
           <p className="text-xl">Item not found in database.</p>
           <p className="text-gray-500 mt-2 text-sm">ID: {id}</p>
        </div>
      </div>
    );
  }

  // 5. Success UI
  const isLost = item.is_lost;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${
      isLost ? "bg-red-900" : "bg-gradient-to-br from-gray-900 via-purple-900 to-black"
    }`}>
      <div className={`backdrop-blur-xl p-8 rounded-2xl shadow-2xl border max-w-md w-full text-center ${
         isLost ? "bg-red-950/80 border-red-500" : "bg-white/10 border-white/20"
      }`}>
        
        {isLost ? (
          <div className="animate-pulse mb-6">
            <h1 className="text-3xl font-extrabold text-red-500 tracking-widest uppercase">⚠️ LOST ITEM ⚠️</h1>
          </div>
        ) : (
          <h1 className="text-3xl font-bold text-white mb-2">Item Found! 🎉</h1>
        )}
  
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
          <p className="text-cyan-400 text-lg font-mono mt-1 break-words">{item.owner_email}</p>
        </div>
  
        <a
          href={`mailto:${item.owner_email}?subject=Found Item: ${item.name}`}
          className={`block w-full py-4 rounded-xl font-bold text-lg ${
            isLost 
            ? "bg-red-600 hover:bg-red-500 text-white" 
            : "bg-cyan-500 hover:bg-cyan-400 text-black"
          }`}
        >
          {isLost ? "🚨 REPORT TO OWNER" : "📧 Contact Owner"}
        </a>
      </div>
    </div>
  );
}