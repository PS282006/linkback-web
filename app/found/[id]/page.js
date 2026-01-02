import { createClient } from '@supabase/supabase-js';

// ✅ Keep this line. It prevents the 404 error by telling Vercel to wait for data.
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function FoundItemPage({ params }) {
  // 1. Get the ID safely
  const { id } = await params;

  // 2. Fetch ONLY the basic info
  const { data: item, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  // 3. Simple Error Screen
  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h1>Item Not Found</h1>
      </div>
    );
  }

  // 4. The Original, Working UI (No Red/Green Logic)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full border border-gray-700">
        
        <h1 className="text-3xl font-bold mb-6 text-cyan-400">Item Found! 🎉</h1>
        
        {/* Image */}
        {item.image_url && (
          <img 
            src={item.image_url} 
            alt="Item" 
            className="w-full h-64 object-cover rounded-lg mb-6 border border-gray-600"
          />
        )}

        {/* Name */}
        <h2 className="text-2xl font-semibold mb-2">{item.name}</h2>
        
        {/* Email Box */}
        <div className="bg-black/40 p-4 rounded-lg mb-6 mt-4">
          <p className="text-gray-400 text-xs uppercase tracking-wide">Owner Contact</p>
          <p className="text-lg font-mono text-cyan-200 mt-1">{item.owner_email}</p>
        </div>

        {/* Contact Button */}
        <a
          href={`mailto:${item.owner_email}?subject=Found Item: ${item.name}`}
          className="block w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all"
        >
          📧 Contact Owner
        </a>

      </div>
    </div>
  );
}