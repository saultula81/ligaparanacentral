import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./Admin.module.css";
import { Edit2, Trash2, Users, Upload, FileJson, FileText, X, PlusCircle, UserMinus } from "lucide-react";

export default function Equipos() {
  const [equipos, setEquipos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [rama, setRama] = useState("Femenina");
  const [escudoUrl, setEscudoUrl] = useState("");

  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [managingTeam, setManagingTeam] = useState<any>(null);
  const [teamPlayers, setTeamPlayers] = useState<any[]>([]);

  // Formulario manual de jugador
  const [mNombre, setMNombre] = useState("");
  const [mDni, setMDni] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data: eData } = await supabase.from('equipos').select('*, categorias(nombre)');
      setEquipos(eData || []);
      const { data: cData } = await supabase.from('categorias').select('*');
      setCategorias(cData || []);
    } catch (error) { console.error(error); }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
        setUploading(true);
        const file = e.target.files?.[0];
        if (!file) return;
        const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from('voley-images').upload(`logos/${fileName}`, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('voley-images').getPublicUrl(`logos/${fileName}`);
        setEscudoUrl(data.publicUrl);
    } catch (error) { alert("Error al subir imagen"); }
    finally { setUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { nombre, categoria_id: categoriaId, rama, escudo_url: escudoUrl };
    try {
        if (editingTeam) {
            await supabase.from('equipos').update(payload).eq('id', editingTeam.id);
        } else {
            await supabase.from('equipos').insert([payload]);
        }
        resetForm();
        fetchData();
    } catch (error) { alert("Error al guardar"); }
  }

  function resetForm() {
    setEditingTeam(null); setNombre(""); setCategoriaId(""); setRama("Femenina"); setEscudoUrl("");
  }

  // GESTION DE JUGADORES
  async function openPlayerManager(equipo: any) {
    setManagingTeam(equipo);
    const { data } = await supabase.from('jugadores_equipos').select('jugadores(*)').eq('equipo_id', equipo.id);
    setTeamPlayers(data?.map(d => d.jugadores) || []);
  }

  async function addPlayerManual() {
    if (!mNombre || !mDni) return;
    try {
        const { data: player } = await supabase.from('jugadores').upsert({ nombre: mNombre, dni: mDni }, { onConflict: 'dni' }).select().single();
        if (player) {
            await supabase.from('jugadores_equipos').upsert({ jugador_id: player.id, equipo_id: managingTeam.id }, { onConflict: 'jugador_id,equipo_id' });
            setMNombre(""); setMDni("");
            openPlayerManager(managingTeam);
        }
    } catch (err) { alert("Error al agregar jugador"); }
  }

  async function removePlayer(playerId: string) {
    await supabase.from('jugadores_equipos').delete().eq('jugador_id', playerId).eq('equipo_id', managingTeam.id);
    openPlayerManager(managingTeam);
  }

  async function handleJsonPlayers(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const players = JSON.parse(event.target?.result as string);
            for (const p of (players.players || players)) {
                const { data } = await supabase.from('jugadores').upsert({ nombre: p.nombre, dni: p.dni }, { onConflict: 'dni' }).select().single();
                if (data) await supabase.from('jugadores_equipos').upsert({ jugador_id: data.id, equipo_id: managingTeam.id }, { onConflict: 'jugador_id,equipo_id' });
            }
            openPlayerManager(managingTeam);
        } catch (err) { alert("Error en JSON"); }
        e.target.value = '';
    };
    reader.readAsText(file);
  }

  async function handleTextPlayers(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const lines = (event.target?.result as string).split('\n');
            let successCount = 0;
            
            for (const line of lines) {
                const cleanLine = line.trim();
                if (!cleanLine) continue;
                
                const dniMatch = cleanLine.match(/\d{7,10}/);
                if (!dniMatch) continue;
                const dni = dniMatch[0];
                
                const nombre = cleanLine.replace(dni, '').replace(/^[,\-\s\t]+|[,\-\s\t]+$/g, '').trim();
                
                if (nombre && dni) {
                    const { data } = await supabase.from('jugadores').upsert({ nombre, dni }, { onConflict: 'dni' }).select().single();
                    if (data) {
                        await supabase.from('jugadores_equipos').upsert({ jugador_id: data.id, equipo_id: managingTeam.id }, { onConflict: 'jugador_id,equipo_id' });
                        successCount++;
                    }
                }
            }
            openPlayerManager(managingTeam);
            alert(`Se procesaron y vincularon ${successCount} jugadores correctamente desde el archivo de texto.`);
        } catch (err) { alert("Error al procesar el archivo de texto"); }
        e.target.value = '';
    };
    reader.readAsText(file);
  }

  return (
    <div className={styles.admin_section}>
      {/* FORMULARIO DE EQUIPO */}
      <section className={styles.admin_card}>
        <h2 className={styles.admin_card__title}>{editingTeam ? 'Editar Equipo' : 'Nuevo Equipo'}</h2>
        <form onSubmit={handleSubmit} className={styles.admin_form__grid}>
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
            <option value="">Categoría...</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          <label className={styles.upload_label}>
            <Upload size={18} /> {uploading ? '...' : 'Escudo'}
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{display:'none'}} />
          </label>
          <button type="submit" className={styles.quick_action}>{editingTeam ? 'Guardar' : 'Crear'}</button>
          {editingTeam && <button onClick={resetForm} className={styles.action_btn}>X</button>}
        </form>
      </section>

      {/* LISTA DE EQUIPOS */}
      <section className={styles.admin_card} style={{marginTop: '20px'}}>
        <h2 className={styles.admin_card__title}>Equipos</h2>
        <table className={styles.admin_table}>
            <thead><tr><th>Nombre</th><th>Categoría</th><th style={{textAlign:'right'}}>Gestión</th></tr></thead>
            <tbody>
                {equipos.map(e => (
                    <tr key={e.id}>
                        <td>{e.nombre}</td>
                        <td>{e.categorias?.nombre}</td>
                        <td style={{textAlign: 'right'}}>
                            <button onClick={() => openPlayerManager(e)} className={styles.action_btn} title="Jugadores" style={{color:'var(--primary)'}}><Users size={20} /></button>
                            <button onClick={() => { setEditingTeam(e); setNombre(e.nombre); setCategoriaId(e.categoria_id); setEscudoUrl(e.escudo_url || ""); }} className={styles.action_btn}><Edit2 size={20} /></button>
                            <button onClick={async () => {if(confirm('¿Eliminar?')){await supabase.from('equipos').delete().eq('id',e.id); fetchData();}}} className={styles.action_btn} style={{color:'#ef4444'}}><Trash2 size={20} /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </section>

      {/* MODAL DE GESTION DE JUGADORES (GLASSMORPHISM) */}
      {managingTeam && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'20px'}}>
            <div className={styles.admin_card} style={{width:'100%', maxWidth:'600px', maxHeight:'90vh', overflowY:'auto', border:'1px solid var(--primary)', boxShadow:'0 0 30px var(--primary-glow)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                    <h3>Plantel: {managingTeam.nombre}</h3>
                    <button onClick={() => setManagingTeam(null)} className={styles.action_btn}><X size={24} /></button>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:'10px', marginBottom:'20px', background:'rgba(255,255,255,0.05)', padding:'15px', borderRadius:'12px'}}>
                    <input type="text" placeholder="Nombre Jugador" value={mNombre} onChange={(e) => setMNombre(e.target.value)} style={{background:'transparent', border:'1px solid var(--glass-border)', color:'white', padding:'8px', borderRadius:'8px'}} />
                    <input type="text" placeholder="DNI" value={mDni} onChange={(e) => setMDni(e.target.value)} style={{background:'transparent', border:'1px solid var(--glass-border)', color:'white', padding:'8px', borderRadius:'8px'}} />
                    <button onClick={addPlayerManual} className={styles.quick_action}><PlusCircle size={20} /></button>
                </div>

                <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
                    <label className={styles.upload_label} style={{width:'100%', borderStyle:'dashed'}}>
                        <FileText size={18} /> Carga Inteligente (.TXT / CSV)
                        <input type="file" accept=".txt,.csv" onChange={handleTextPlayers} style={{display:'none'}} />
                    </label>

                    <label className={styles.upload_label} style={{width:'100%', borderStyle:'dashed', opacity: 0.7}}>
                        <FileJson size={18} /> JSON
                        <input type="file" accept=".json" onChange={handleJsonPlayers} style={{display:'none'}} />
                    </label>
                </div>

                <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                    {teamPlayers.map(p => (
                        <div key={p.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.03)', padding:'10px 15px', borderRadius:'8px'}}>
                            <span>{p.nombre} <small style={{color:'var(--text-muted)'}}>(DNI: {p.dni})</small></span>
                            <button onClick={() => removePlayer(p.id)} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer'}}><UserMinus size={18} /></button>
                        </div>
                    ))}
                    {teamPlayers.length === 0 && <p style={{textAlign:'center', color:'var(--text-muted)'}}>No hay jugadores cargados.</p>}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
