import { createClient } from '@supabase/supabase-js';

// 1. Setup Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 2. Simple Page Component
export default async function FoundItemPage({ params }) {
  // Await params to fix the Next.js 15 error
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
      <div style={{ padding: 50, textAlign: 'center', color: 'white', backgroundColor: 'black', height: '100vh' }}>
        <h1>Item Not Found</h1>
        <p>Could not find item with ID: {id}</p>
      </div>
    );
  }

  // 5. Simple Display (No Red Alert Logic)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        
        <h1 className="text-2xl font-bold mb-4">Item Found!</h1>
        
        {/* Show Image if it exists */}
        {item.image_url && (
          <img 
            src={item.image_url} 
            alt="Item" 
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <h2 className="text-xl text-cyan-400 mb-2">{item.name}</h2>
        <p className="text-gray-400 mb-6">This item belongs to:</p>
        
        <div className="bg-black p-4 rounded mb-6">
          <code className="text-yellow-400">{item.owner_email}</code>
        </div>

        <a
          href={`mailto:${item.owner_email}?subject=Found Item: ${item.name}`}
          className="block w-full bg-cyan-600 py-3 rounded text-white font-bold hover:bg-cyan-500"
        >
          Contact Owner
        </a>

      </div>
    </div>
  );
}