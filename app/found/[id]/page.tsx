'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zmsfxvnbravzlzqtxxrv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptc2Z4dm5icmF2emx6cXR4eHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODk4MTMsImV4cCI6MjA4Mjg2NTgxM30.h7wCxW_vqA43nFBYMAZle-1V2En_4zsO-qt5qHgthP4'
);

type Item = {
  id: string;
  name: string;
  owner_email: string;
  image_url: string | null;
};

export default function FoundPage({ params }: { params: Promise<{ id: string }> }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [finderMessage, setFinderMessage] = useState('');
  const [finderContact, setFinderContact] = useState('');
  const [sending, setSending] = useState(false);
  const [itemId, setItemId] = useState<string>('');

  useEffect(() => {
    async function fetchItem() {
      const { id } = await params;
      setItemId(id);
      const { data, error } = await supabase
        .from('items')
        .select('id, name, owner_email, image_url')
        .eq('id', id)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setItem(data);
      }
      setLoading(false);
    }
    fetchItem();
  }, [params]);

  async function handleReport() {
    if (!finderContact.trim()) return;
    setSending(true);

    // Insert a "found_reports" record so the owner gets notified
    await supabase.from('found_reports').insert({
      item_id: itemId,
      finder_contact: finderContact.trim(),
      finder_message: finderMessage.trim(),
    });

    setSending(false);
    setReportSent(true);
  }

  // ── Loading ──
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.spinner} />
          <p style={{ color: '#94a3b8', marginTop: 16 }}>Looking up item…</p>
        </div>
      </div>
    );
  }

  // ── Not Found ──
  if (notFound || !item) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.iconCircle('#ef44441a')}>
            <span style={{ fontSize: 40 }}>❌</span>
          </div>
          <h1 style={styles.title}>Item Not Found</h1>
          <p style={styles.subtitle}>
            This QR code doesn't match any registered item. It may have been removed by its owner.
          </p>
        </div>
      </div>
    );
  }

  // ── Report Sent ──
  if (reportSent) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.iconCircle('#22c55e1a')}>
            <span style={{ fontSize: 40 }}>✅</span>
          </div>
          <h1 style={styles.title}>Owner Notified!</h1>
          <p style={styles.subtitle}>
            Thank you for being honest. The owner of <strong style={{ color: '#22d3ee' }}>{item.name}</strong> has
            been notified with your contact details.
          </p>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 12 }}>You can close this page.</p>
        </div>
      </div>
    );
  }

  // ── Main Found Page ──
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.iconCircle('#22d3ee1a')}>
          <span style={{ fontSize: 36 }}>🔍</span>
        </div>
        <h1 style={styles.title}>Lost Item Found!</h1>
        <p style={styles.subtitle}>You've scanned a LinkBack QR code. Please help return this item.</p>

        {/* Item Info */}
        <div style={styles.itemBox}>
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.name}
              style={styles.itemImage}
            />
          )}
          <div>
            <p style={styles.itemLabel}>ITEM NAME</p>
            <p style={styles.itemName}>{item.name}</p>
            <p style={styles.itemLabel}>OWNER CONTACT</p>
            <a href={`mailto:${item.owner_email}`} style={styles.ownerEmail}>
              {item.owner_email}
            </a>
          </div>
        </div>

        <div style={styles.divider} />

        {/* Report Form */}
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>
          Or fill in your details and we'll notify the owner for you:
        </p>

        <input
          style={styles.input}
          type="text"
          placeholder="Your phone / email *"
          value={finderContact}
          onChange={(e) => setFinderContact(e.target.value)}
        />
        <textarea
          style={{ ...styles.input, height: 90, resize: 'none' }}
          placeholder="Optional message (e.g. where you found it)"
          value={finderMessage}
          onChange={(e) => setFinderMessage(e.target.value)}
        />

        <button
          style={{
            ...styles.button,
            opacity: finderContact.trim() ? 1 : 0.5,
            cursor: finderContact.trim() ? 'pointer' : 'not-allowed',
          }}
          onClick={handleReport}
          disabled={!finderContact.trim() || sending}
        >
          {sending ? 'Sending…' : '📩 Notify Owner'}
        </button>
      </div>

      <p style={{ color: '#334155', fontSize: 12, marginTop: 24 }}>Powered by LinkBack Security</p>
    </div>
  );
}

// ── Inline styles (no extra config needed) ──
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f3460 100%)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: '36px 28px',
    maxWidth: 440,
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    backdropFilter: 'blur(12px)',
  },
  iconCircle: (bg: string) => ({
    background: bg,
    borderRadius: '50%',
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  }),
  title: {
    color: '#f1f5f9',
    fontSize: 26,
    fontWeight: 700,
    margin: '0 0 10px',
    textAlign: 'center' as const,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 15,
    textAlign: 'center' as const,
    lineHeight: 1.6,
    margin: '0 0 24px',
  },
  itemBox: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: '16px 20px',
    width: '100%',
    display: 'flex',
    gap: 16,
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    objectFit: 'cover' as const,
    flexShrink: 0,
  },
  itemLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 1,
    margin: '0 0 3px',
  },
  itemName: {
    color: '#22d3ee',
    fontSize: 20,
    fontWeight: 700,
    margin: '0 0 10px',
  },
  ownerEmail: {
    color: '#a78bfa',
    fontSize: 14,
    textDecoration: 'none',
  },
  divider: {
    width: '100%',
    height: 1,
    background: 'rgba(255,255,255,0.07)',
    margin: '24px 0',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#f1f5f9',
    fontSize: 14,
    marginBottom: 12,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  button: {
    width: '100%',
    background: 'linear-gradient(90deg, #22d3ee, #818cf8)',
    border: 'none',
    borderRadius: 10,
    padding: '14px',
    color: '#0f172a',
    fontWeight: 700,
    fontSize: 15,
    marginTop: 4,
    transition: 'opacity 0.2s',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid rgba(34,211,238,0.2)',
    borderTop: '3px solid #22d3ee',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};
