import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./Admin.module.css";
import { Upload, Trophy, Info } from "lucide-react";

export default function Resultados() {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [selectedPartido, setSelectedPartido] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [setsA, setSetsA] = useState<number[]>([]);
  const [setsB, setSetsB] = useState<number[]>([]);
  const [cronica, setCronica] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  useEffect(() => {
    fetchPartidosPendientes();
  }, []);

  async function fetchPartidosPendientes() {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('partidos')
        .select('*, equipo_a:equipos!equipo_a_id(nombre), equipo_b:equipos!equipo_b_id(nombre), categorias(nombre)')
        .eq('finalizado', false)
        .order('fecha', { ascending: true });
      setPartidos(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
        setUploading(true);
        const file = e.target.files?.[0];
        if (!file) return;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `partidos/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('voley-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('voley-images')
            .getPublicUrl(filePath);

        setFotoUrl(data.publicUrl);
        alert("Foto cargada ✓");
    } catch (error) {
        alert("Error al subir imagen");
    } finally {
        setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPartido) return;

    try {
        // 1. Guardar resultado
        const { error: resError } = await supabase.from('resultados').insert([{
            partido_id: selectedPartido.id,
            sets_a: setsA,
            sets_b: setsB,
            cronica,
            foto_url: fotoUrl
        }]);

        if (resError) throw resError;

        // 2. Marcar partido como finalizado
        await supabase.from('partidos').update({ finalizado: true }).eq('id', selectedPartido.id);

        alert("Resultado publicado con éxito");
        setSelectedPartido(null);
        setSetsA([]); setSetsB([]); setCronica(""); setFotoUrl("");
        fetchPartidosPendientes();
    } catch (error) {
        alert("Error al publicar resultado");
    }
  }

  return (
    <div className={styles.admin_section}>
      <section className={styles.admin_card}>
        <h2 className={styles.admin_card__title}><Trophy size={20} /> Cargar Resultado</h2>
        
        {!selectedPartido ? (
            <div className={styles.table_container}>
                <p style={{color: 'var(--text-muted)', marginBottom: '20px'}}>Selecciona un partido del fixture para cargar su resultado:</p>
                <table className={styles.admin_table}>
                    <thead>
                        <tr><th>Fecha</th><th>Categoría</th><th>Encuentro</th><th>Acción</th></tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={4}>Cargando partidos...</td></tr> : partidos.map(p => (
                            <tr key={p.id}>
                                <td>{p.fecha}</td>
                                <td>{p.categorias?.nombre}</td>
                                <td style={{fontWeight: 700}}>{p.equipo_a.nombre} vs {p.equipo_b.nombre}</td>
                                <td>
                                    <button onClick={() => setSelectedPartido(p)} className={styles.quick_action} style={{padding: '5px 15px', fontSize: '0.8rem'}}>
                                        Cargar Datos
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!loading && partidos.length === 0 && <tr><td colSpan={4} style={{textAlign: 'center'}}>No hay partidos pendientes en el fixture.</td></tr>}
                    </tbody>
                </table>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className={styles.admin_form}>
                <div style={{background: 'rgba(37,99,235,0.1)', padding: '20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <span style={{fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800}}>{selectedPartido.categorias?.nombre}</span>
                        <h3 style={{margin: 0}}>{selectedPartido.equipo_a.nombre} vs {selectedPartido.equipo_b.nombre}</h3>
                    </div>
                    <button type="button" onClick={() => setSelectedPartido(null)} className={styles.action_btn} style={{color: 'white'}}>Cambiar Partido</button>
                </div>

                <div className={styles.admin_form__grid}>
                    <div className={styles.admin_form__group}>
                        <label>Puntaje Sets (Ej: 25, 19, 15)</label>
                        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <span>{selectedPartido.equipo_a.nombre}:</span>
                            <input type="text" placeholder="25, 25" onChange={(e) => setSetsA(e.target.value.split(',').map(Number))} required />
                        </div>
                        <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px'}}>
                            <span>{selectedPartido.equipo_b.nombre}:</span>
                            <input type="text" placeholder="20, 15" onChange={(e) => setSetsB(e.target.value.split(',').map(Number))} required />
                        </div>
                    </div>

                    <div className={styles.admin_form__group}>
                        <label>Foto del Encuentro</label>
                        <label className={styles.upload_label}>
                            <Upload size={18} /> {uploading ? 'Subiendo...' : 'Elegir Foto'}
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{display:'none'}} />
                        </label>
                        {fotoUrl && <div style={{color: 'var(--primary)', fontSize: '0.7rem'}}>Imagen lista ✓</div>}
                    </div>
                </div>

                <div className={styles.admin_form__group} style={{marginTop: '20px'}}>
                    <label>Crónica del Partido</label>
                    <textarea 
                        value={cronica} 
                        onChange={(e) => setCronica(e.target.value)} 
                        rows={5} 
                        style={{background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', padding: '15px'}}
                        placeholder="Escribe aquí lo mejor del partido..."
                        required
                    />
                </div>

                <button type="submit" className={styles.quick_action} style={{marginTop: '20px', width: '100%'}}>
                    Publicar en el Diario Digital
                </button>
            </form>
        )}
      </section>

      <section className={styles.admin_card} style={{marginTop: '20px', background: 'rgba(255,255,255,0.02)'}}>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--primary)'}}>
              <Info size={18} />
              <p style={{fontSize: '0.8rem', margin: 0}}>Los resultados cargados aquí se verán instantáneamente en la App para todos los usuarios.</p>
          </div>
      </section>
    </div>
  );
}
