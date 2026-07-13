import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X } from 'lucide-react';

const YELLOW = "#F6D67C";
const BROWN = "#2c1f0e";
const CREAM = "#faf6ed";
const CREAM2 = "#f2e9d8";
const SERIF = "'Cormorant Garamond', 'Georgia', serif";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ text: '¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.', type: 'success' });
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else if (mode === 'recover') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage({ text: 'Te enviaremos un correo con instrucciones para recuperar tu contraseña.', type: 'success' });
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(44,31,14,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: CREAM, padding: '40px', borderRadius: '16px', maxWidth: '400px', width: '90%', position: 'relative', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: BROWN }}>
          <X size={24} />
        </button>

        <h2 style={{ fontFamily: SERIF, fontSize: '2rem', color: BROWN, marginBottom: '24px', textAlign: 'center', fontWeight: 700 }}>
          {mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Registrarse' : 'Recuperar Contraseña'}
        </h2>

        {message.text && (
          <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', background: message.type === 'error' ? '#fdecea' : '#eaf8e9', color: message.type === 'error' ? '#c0392b' : '#27ae60' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: BROWN, fontWeight: 600 }}>Correo electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${CREAM2}`, background: '#fff', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>

          {mode !== 'recover' && (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: BROWN, fontWeight: 600 }}>Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${CREAM2}`, background: '#fff', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '24px', background: YELLOW, color: BROWN, fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : mode === 'register' ? 'Crear Cuenta' : 'Enviar Correo'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: BROWN }}>
          {mode === 'login' ? (
            <>
              <p style={{ marginBottom: '8px' }}>¿No tienes cuenta? <button onClick={() => {setMode('register'); setMessage({text:'', type:''})}} style={{ background: 'none', border: 'none', color: BROWN, textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>Regístrate</button></p>
              <p><button onClick={() => {setMode('recover'); setMessage({text:'', type:''})}} style={{ background: 'none', border: 'none', color: BROWN, textDecoration: 'underline', cursor: 'pointer' }}>¿Olvidaste tu contraseña?</button></p>
            </>
          ) : (
            <p>¿Ya tienes cuenta? <button onClick={() => {setMode('login'); setMessage({text:'', type:''})}} style={{ background: 'none', border: 'none', color: BROWN, textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>Inicia sesión</button></p>
          )}
        </div>
      </div>
    </div>
  );
}
