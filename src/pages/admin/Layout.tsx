import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LogOut, Download } from 'lucide-react';
import styles from './Admin.module.css';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 0. Proteger ruta: Verificar si hay sesion activa
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkAuth();

    // 1. Escuchar el evento de instalacion
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert("Para instalar esta aplicación, haz clic en el ícono de 'Instalar' (🖵) que aparece en la barra de direcciones de tu navegador, arriba a la derecha.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? styles['admin__link--active'] : '';

  // Determinar si ya está instalada (modo standalone)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  return (
    <div className={styles.admin}>
      <aside className={styles.admin__sidebar}>
        <div className={styles.admin__logo}>
          <img src="/liga.png" alt="Logo Liga" style={{width: '100%', maxWidth: '140px', height: 'auto', display: 'block', margin: '0 auto'}} />
        </div>
        <nav className={styles.admin__nav}>
          <Link to="/diario" className={styles.admin__link} style={{backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', marginBottom: '10px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <span style={{fontSize: '1.2rem'}}>📰</span>
              <span>Ver Diario y Actualizaciones</span>
            </div>
          </Link>
          <div style={{height: '1px', backgroundColor: 'var(--border)', margin: 'var(--gap-sm) 0'}}></div>
          <Link to="/admin" className={`${styles.admin__link} ${location.pathname === '/admin' ? styles.admin__link : ''}`} style={{fontWeight: 700, color: 'white'}}>
            <span style={{marginRight: '10px'}}>🏠</span> Inicio / Guía
          </Link>
          <Link to="/admin/equipos" className={`${styles.admin__link} ${isActive('/admin/equipos')}`}>Equipos y Categorias</Link>

          <Link to="/admin/fixture" className={`${styles.admin__link} ${isActive('/admin/fixture')}`}>Generar Fixture</Link>
          <Link to="/admin/resultados" className={`${styles.admin__link} ${isActive('/admin/resultados')}`}>Carga de Resultados</Link>
          
          <button onClick={handleLogout} className={styles.admin__link} style={{marginTop: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%', color: '#ef4444'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </div>
          </button>
        </nav>
      </aside>

      <main className={styles.admin__content}>
        <header style={{display: 'flex', justifyContent: 'flex-end', padding: '20px', position: 'sticky', top: 0, zIndex: 100}}>
          {!isStandalone && (
            <button 
              onClick={handleInstall} 
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', 
                background: 'var(--primary)', color: 'white', 
                border: 'none', padding: '10px 20px', 
                borderRadius: '8px', cursor: 'pointer',
                fontWeight: 700, boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
              }}>
              <Download size={18} />
              <span>Descargar e Instalar Panel</span>
            </button>
          )}
        </header>
        <Outlet />
      </main>
    </div>
  );
}
