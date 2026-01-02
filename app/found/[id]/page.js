import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function Page({ params }) {
  const { id } = await params;

  const { data: item } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  if (!item) {
    return <div style={{color: 'white', textAlign: 'center', padding: '50px'}}>Item Not Found</div>;
  }

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#00f2ff' }}>LinkBack Security</h1>
      <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '15px', display: 'inline-block', border: '1px solid #333' }}>
        <h2>Found: {item.name}</h2>
        {item.image_url && <img src={item.image_url} style={{ width: '100%', maxWidth: '300px', borderRadius: '10px', margin: '20px 0' }} />}
        <p style={{ color: '#aaa' }}>Contact the owner at:</p>
        <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.owner_email}</p>
        <a href={`mailto:${item.owner_email}`} style={{ display: 'block', marginTop: '20px', padding: '12px', background: '#00f2ff', color: 'black', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          Contact Owner
        </a>
      </div>
    </div>
  );
}