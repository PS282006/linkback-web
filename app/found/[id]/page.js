import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function Page({ params }) {
  const { id } = await params;
  const { data: item } = await supabase.from('items').select('*').eq('id', id).single();

  if (!item) return <h1 style={{color: 'white', textAlign: 'center'}}>Item Not Found</h1>;

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', textAlign: 'center', paddingTop: '50px', fontFamily: 'sans-serif' }}>
      <h1 style={{color: '#00f2ff'}}>LinkBack Security</h1>
      <div style={{background: '#1e1e1e', padding: '30px', borderRadius: '20px', display: 'inline-block', border: '1px solid #333'}}>
        <h2>Owner: {item.owner_email}</h2>
        <p>Item: {item.name}</p>
        {item.image_url && <img src={item.image_url} style={{width: '300px', borderRadius: '10px', marginTop: '10px'}} />}
      </div>
    </div>
  );
}