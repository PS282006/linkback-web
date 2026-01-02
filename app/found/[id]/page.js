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

  if (!item) return <h1 style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Item Not Found</h1>;

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: '#00f2ff' }}>Item Found: {item.name}</h1>
      {item.image_url && <img src={item.image_url} style={{ width: '100%', maxWidth: '300px', borderRadius: '15px', margin: '20px 0' }} />}
      <p>Contact Owner: {item.owner_email}</p>
      <a href={`mailto:${item.owner_email}`} style={{ display: 'inline-block', padding: '15px 30px', backgroundColor: '#00f2ff', color: 'black', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
        Send Email
      </a>
    </div>
  );
}