import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { X, LogOut, User as UserIcon } from 'lucide-react';

const YELLOW = "#F6D67C";
const BROWN = "#2c1f0e";
const CREAM = "#faf6ed";
const SERIF = "'Cormorant Garamond', 'Georgia', serif";

export default function AccountModal({ user, onClose }: { user: User, onClose: () => void }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(44,31,14,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: CREAM, padding: '40px', borderRadius: '16px', maxWidth: '400px', width: '90%', position: 'relative', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: BROWN }}>
          <X size={24} />
        </button>

        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: YELLOW, color: BROWN, marginBottom: '20px' }}>
          <UserIcon size={32} />
        </div>

        <h2 style={{ fontFamily: SERIF, fontSize: '2rem', color: BROWN, marginBottom: '8px', fontWeight: 700 }}>
          Mi Cuenta
        </h2>
        
        <p style={{ color: BROWN, fontSize: '0.9rem', marginBottom: '30px' }}>
          {user.email}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button style={{ width: '100%', padding: '14px', borderRadius: '24px', background: 'transparent', border: `2px solid ${BROWN}`, color: BROWN, fontWeight: 600, cursor: 'pointer' }}>
            Mis Compras (Próximamente)
          </button>
          
          <button onClick={handleSignOut} style={{ width: '100%', padding: '14px', borderRadius: '24px', background: '#fdecea', color: '#c0392b', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
