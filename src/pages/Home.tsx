import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Monitor, Apple, Smartphone } from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Detectar INSTANTANEAMENTE si es modo standalone
  const [isInstalled] = useState(() => {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone ||
           document.referrer.includes('android-apk');
  });

  useEffect(() => {
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
      // Redirigir al Diario tras el intento de instalacion
      navigate('/diario');
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert("En iOS: Pulsa 'Compartir' y luego 'Añadir a la pantalla de inicio'.");
      } else {
        // Si no hay prompt, igual permitimos entrar al Diario
        navigate('/diario');
      }
    }
  };

  if (isInstalled) {
    return <Navigate to="/diario" replace />;
  }

  return (
    <div className={styles.hero}>
      <div className={styles.hero__overlay}></div>
      <div className={styles.hero__content}>
        <h1 className={styles.hero__title}>{'Liga de Volley Parana Central'}</h1>
        <p className={styles.hero__subtitle}>{'La pasion del volley en un solo lugar.'}</p>

        <div className={styles.install_section}>
          <p className={styles.install_text}>{'INSTALA LA APP OFICIAL PARA COMENZAR:'}</p>
          <div className={styles.install_buttons}>
            <button onClick={handleInstall} className={styles.install_button}>
              <Monitor size={20} />
              <span>{'Windows / Linux'}</span>
            </button>
            <button onClick={handleInstall} className={styles.install_button} style={{ opacity: 0.8 }}>
              <Apple size={20} />
              <span>{'iOS / iPhone'}</span>
            </button>
            <button onClick={handleInstall} className={styles.install_button}>
              <Smartphone size={20} />
              <span>{'Android / APK'}</span>
            </button>
          </div>
        </div>

        <div style={{marginTop: '40px'}}>
            <button onClick={() => navigate('/login')} className={styles.admin_entry_btn}>
                <Monitor size={20} />
                <span>Acceso Administrador</span>
            </button>
        </div>
      </div>
    </div>
  );
}
