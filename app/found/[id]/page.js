import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function Page({ params }) {
  const { id } = await params;
  const { data: item } = await supabase.from('items').select('*').eq('id', id).single();

  if (!item) return <div style={{color: 'white', textAlign: 'center', padding: '100px'}}><h1>Item Not Found</h1></div>;

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '24px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        <h1 style={{ color: '#22d3ee', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>LinkBack Security</h1>
        <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Secure Asset Recovery</p>

        {item.image_url && (
          <img src={item.image_url} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px', border: '2px solid #22d3ee' }} />
        )}

        <h2 style={{ color: 'white', fontSize: '22px', marginBottom: '16px' }}>{item.name}</h2>
        
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', marginBottom: '32px' }}>
          <p style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Registered Owner</p>
          <p style={{ color: 'white', fontWeight: '500' }}>{item.owner_email}</p>
        </div>

        <a 
          href={`mailto:${item.owner_email}?subject=Found Item: ${item.name}`} 
          style={{ display: 'block', background: '#22d3ee', color: '#0f172a', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px', transition: '0.3s' }}
        >
          📧 Contact Owner
        </a>

        <p style={{ marginTop: '32px', color: '#475569', fontSize: '11px' }}>ID: {item.id}</p>
      </div>
    </div>
  );
}