import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import styles from './Admin.module.css';
import { Trophy, Calendar, ArrowRight, Activity, Shield } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ equipos: 0, categorias: 0 });

  useEffect(() => {
    async function fetchStats() {
      const { count: eCount } = await supabase.from('equipos').select('*', { count: 'exact', head: true });
      const { count: cCount } = await supabase.from('categorias').select('*', { count: 'exact', head: true });
      setStats({ equipos: eCount || 0, categorias: cCount || 0 });
    }
    fetchStats();
  }, []);

  const steps = [
    {
      title: "1. Equipos y Categorías",
      desc: "Registra los clubes y define las categorías de juego.",
      icon: <Shield size={32} color="#3b82f6" />,
      path: "/admin/equipos",
      stat: `${stats.equipos} Equipos`
    },
    {
      title: "2. Generar Fixture",
      desc: "Crea el calendario con detección de conflictos.",
      icon: <Calendar size={32} color="#f59e0b" />,
      path: "/admin/fixture",
      stat: "Calendario"
    },
    {
      title: "3. Cargar Resultados",
      desc: "Publica marcadores y crónicas al Diario Digital.",
      icon: <Trophy size={32} color="#ef4444" />,
      path: "/admin/resultados",
      stat: "Resultados"
    }
  ];

  return (
    <div className={styles.admin_section}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '10px' }}>
          Bienvenido, <span style={{ color: 'var(--primary)' }}>Administrador</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Gestión integral de la Liga Paraná Central</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
        {steps.map((step, index) => (
          <div key={index} className={styles.admin_card} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                    {step.icon}
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{step.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>{step.stat}</span>
                </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', flex: 1 }}>{step.desc}</p>
            <button onClick={() => navigate(step.path)} className={styles.quick_action}>
              Comenzar <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>

      <section className={styles.admin_card} style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '30px', background: 'linear-gradient(90deg, rgba(37,99,235,0.1), transparent)' }}>
         <div style={{ background: 'var(--primary)', padding: '20px', borderRadius: '50%' }}>
            <Activity size={30} color="white" />
         </div>
         <div>
            <h2 style={{ margin: 0 }}>Estado de la Liga</h2>
            <p style={{ margin: '5px 0 0', color: 'var(--text-muted)' }}>Información sincronizada en tiempo real.</p>
         </div>
         <div style={{ marginLeft: 'auto', display: 'flex', gap: '40px' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{stats.categorias}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>CATEGORÍAS</div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{stats.equipos}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>CLUBES</div>
            </div>
         </div>
      </section>
    </div>
  );
}
