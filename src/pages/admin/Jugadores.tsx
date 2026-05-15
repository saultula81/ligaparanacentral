import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./Admin.module.css";
import pageStyles from "./Jugadores.module.css";
import { Search, UserPlus, Calendar } from "lucide-react";

export default function Jugadores() {
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [partidos, setPartidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [equipoId, setEquipoId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const { data: playerData } = await supabase
        .from('jugadores')
        .select(`
          id, nombre, dni,
          jugadores_equipos (
            equipo_id,
            equipos (nombre, categorias (nombre))
          )
        `)
        .order('nombre');
      setPlayers(playerData || []);

      const { data: teamData } = await supabase
        .from('equipos')
        .select('id, nombre, categorias(nombre)');
      setTeams(teamData || []);

      // Traer proximos partidos para el buscador inteligente
      const { data: matches } = await supabase
        .from('partidos')
        .select('*, equipo_a:equipos!equipo_a_id(nombre), equipo_b:equipos!equipo_b_id(nombre)')
        .eq('finalizado', false)
        .order('fecha');
      setPartidos(matches || []);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre || !dni || !equipoId) return;

    try {
      const { data: player, error: pError } = await supabase
        .from('jugadores')
        .upsert({ nombre, dni }, { onConflict: 'dni' })
        .select().single();

      if (pError) throw pError;

      await supabase.from('jugadores_equipos').upsert({ 
          jugador_id: player.id, 
          equipo_id: equipoId 
      }, { onConflict: 'jugador_id,equipo_id' });

      alert("Jugador registrado y vinculado con éxito.");
      setNombre(""); setDni(""); fetchData();
    } catch (error) {
      alert("Error al registrar jugador");
    }
  }

  const filteredPlayers = players.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.dni.includes(searchTerm)
  );

  return (
    <div className={pageStyles.container}>
      <section className={styles.admin_card}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'}}>
            <Search size={24} color="var(--primary)" />
            <input 
                type="text" 
                placeholder="BUSCAR JUGADOR POR NOMBRE O DNI..." 
                className={styles.admin_form__group + ' ' + styles.admin_form__group_input}
                style={{width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white'}}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </section>

      <section className={styles.admin_card} style={{marginTop: '20px'}}>
        <h2 className={styles.admin_card__title}><UserPlus size={20} /> Registro Rápido</h2>
        <form onSubmit={handleSubmit} className={styles.admin_form__grid}>
            <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            <input type="text" placeholder="DNI" value={dni} onChange={(e) => setDni(e.target.value)} required />
            <select value={equipoId} onChange={(e) => setEquipoId(e.target.value)} required>
                <option value="">Seleccionar Equipo...</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.nombre} ({t.categorias?.nombre})</option>)}
            </select>
            <button type="submit" className={styles.quick_action}>Vincular</button>
        </form>
      </section>

      <div className={pageStyles.player_list} style={{marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px'}}>
        {loading ? <p>Cargando base de datos...</p> : filteredPlayers.map(player => {
            const playerTeamIds = player.jugadores_equipos?.map((rel: any) => rel.equipo_id) || [];
            const playerMatches = partidos.filter(m => playerTeamIds.includes(m.equipo_a_id) || playerTeamIds.includes(m.equipo_b_id));

            return (
              <div key={player.id} className={styles.admin_card} style={{borderLeft: '4px solid var(--primary)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <div>
                        <h3 style={{margin: 0, fontSize: '1.2rem'}}>{player.nombre}</h3>
                        <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>DNI: {player.dni}</p>
                    </div>
                    <div style={{background: 'rgba(37,99,235,0.1)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700}}>
                        ACTIVO
                    </div>
                </div>

                <div style={{marginTop: '15px'}}>
                    <p style={{fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '5px'}}>Equipos</p>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px'}}>
                        {player.jugadores_equipos?.map((rel: any, idx: number) => (
                            <span key={idx} style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem'}}>
                                {rel.equipos?.nombre}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                    <p style={{fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px'}}>
                        <Calendar size={14} /> PRÓXIMOS PARTIDOS
                    </p>
                    {playerMatches.length === 0 ? (
                        <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>No tiene partidos programados.</p>
                    ) : (
                        playerMatches.map(m => (
                            <div key={m.id} style={{fontSize: '0.85rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between'}}>
                                <span>{m.equipo_a.nombre} vs {m.equipo_b.nombre}</span>
                                <span style={{color: 'var(--text-muted)'}}>{m.fecha}</span>
                            </div>
                        ))
                    )}
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
}
