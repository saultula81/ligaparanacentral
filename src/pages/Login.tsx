import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Key, ArrowRight } from 'lucide-react';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciales incorrectas o usuario no encontrado.');
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_card}>
        <div className={styles.login_header}>
          <div className={styles.icon_box}>
            <Lock size={32} color="var(--primary)" />
          </div>
          <h1>Acceso Administrador</h1>
          <p>Ingresa tus credenciales para gestionar la liga</p>
        </div>

        <form onSubmit={handleLogin} className={styles.login_form}>
          <div className={styles.input_group}>
            <label><Mail size={16} /> Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@liga.com"
              required 
            />
          </div>

          <div className={styles.input_group}>
            <label><Key size={16} /> Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          {error && <div className={styles.error_msg}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.login_btn}>
            {loading ? 'Verificando...' : 'Entrar al Panel'} <ArrowRight size={18} />
          </button>
        </form>

        <button onClick={() => navigate('/')} className={styles.back_btn}>
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}
