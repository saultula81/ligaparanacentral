import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./Admin.module.css";
import pageStyles from "./Fixture.module.css";
import { Calendar, AlertTriangle, Clock } from "lucide-react";

export default function Fixture() {
  const [equipos, setEquipos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [partidos, setPartidos] = useState<any[]>([]);

  // Estados para la generacion
  const [modo, setModo] = useState("fecha"); // fecha, mensual, anual
  const [fechaInicio, setFechaInicio] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [conflictos, setConflictos] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data: eData } = await supabase
        .from('equipos')
        .select(`
          id, nombre, categoria_id,
          jugadores_equipos (jugador_id)
        `);
      setEquipos(eData || []);

      const { data: cData } = await supabase.from('categorias').select('*');
      setCategorias(cData || []);

      const { data: pData } = await supabase
        .from('partidos')
        .select('*, equipo_a:equipos!equipo_a_id(nombre), equipo_b:equipos!equipo_b_id(nombre), categorias(nombre)')
        .order('fecha')
        .order('hora');
      setPartidos(pData || []);
    } catch (error) {
      console.error(error);
    }
  }

  // LOGICA DE DETECCION DE CONFLICTOS DE JUGADORES
  function checkPlayerConflict(teamAId: string, teamBId: string, fechaStr: string, horaStr: string) {
    const teamA = equipos.find(e => e.id === teamAId);
    const teamB = equipos.find(e => e.id === teamBId);
    
    if (!teamA || !teamB) return null;

    const playersA = teamA.jugadores_equipos.map((r: any) => r.jugador_id);
    const playersB = teamB.jugadores_equipos.map((r: any) => r.jugador_id);
    const allPlayersInMatch = [...new Set([...playersA, ...playersB])];

    // Buscar otros partidos en la misma fecha y hora
    const concurrentMatches = partidos.filter(p => p.fecha === fechaStr && p.hora === horaStr);
    
    for (const match of concurrentMatches) {
        const teamX = equipos.find(e => e.id === match.equipo_a_id);
        const teamY = equipos.find(e => e.id === match.equipo_b_id);
        const playersX = teamX?.jugadores_equipos.map((r: any) => r.jugador_id) || [];
        const playersY = teamY?.jugadores_equipos.map((r: any) => r.jugador_id) || [];
        const playersInOtherMatch = [...playersX, ...playersY];

        const commonPlayers = allPlayersInMatch.filter(p => playersInOtherMatch.includes(p));
        if (commonPlayers.length > 0) {
            return `Conflicto: Hay jugadores que ya juegan en el partido ${match.equipo_a.nombre} vs ${match.equipo_b.nombre} a las ${match.hora}`;
        }
    }
    return null;
  }

  async function handleGenerate() {
    if (!categoriaId || !fechaInicio) {
        alert("Selecciona categoria y fecha de inicio");
        return;
    }

    const filteredEquipos = equipos.filter(e => e.categoria_id === categoriaId);
    if (filteredEquipos.length < 2) {
        alert("Se necesitan al menos 2 equipos en esta categoria");
        return;
    }

    // Algoritmo simple de generacion de parejas
    const newMatches = [];
    const availableTeams = [...filteredEquipos];
    
    // Generacion basica de una fecha (puedes expandir a mensual/anual)
    for (let i = 0; i < availableTeams.length; i += 2) {
      if (availableTeams[i+1]) {
        const teamA = availableTeams[i];
        const teamB = availableTeams[i+1];
        const hora = `${14 + (i/2)}:00:00`; // Comienza a las 14:00, cada hora y media aprox
        
        const conflicto = checkPlayerConflict(teamA.id, teamB.id, fechaInicio, hora);
        if (conflicto) {
            setConflictos(prev => [...prev, conflicto]);
        }

        newMatches.push({
          equipo_a_id: teamA.id,
          equipo_b_id: teamB.id,
          categoria_id: categoriaId,
          fecha: fechaInicio,
          hora: hora,
          lugar: "Club Parana Central"
        });
      }
    }

    if (newMatches.length > 0) {
        const { error } = await supabase.from('partidos').insert(newMatches);
        if (error) alert("Error guardando fixture");
        else {
            alert("Fixture generado con exito");
            fetchData();
        }
    }
  }

  return (
    <div className={pageStyles.container}>
      <section className={pageStyles.config_card}>
        <div className={pageStyles.section_title}>
            <Calendar size={20} color="var(--primary)" />
            <h2>Generador Inteligente de Fixture</h2>
        </div>
        
        <div className={pageStyles.options_grid}>
          <div className={pageStyles.option_group}>
            <label>Modo de Generacion</label>
            <select value={modo} onChange={(e) => setModo(e.target.value)} className={pageStyles.input}>
              <option value="fecha">Por Fecha Unica</option>
              <option value="mensual">Mensual (4 Fines de semana)</option>
              <option value="anual">Anual (Temporada completa)</option>
            </select>
          </div>

          <div className={pageStyles.option_group}>
            <label>Categoria</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={pageStyles.input}>
              <option value="">Seleccionar...</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>

          <div className={pageStyles.option_group}>
            <label>Fecha de Inicio (Sab/Dom)</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className={pageStyles.input} />
          </div>
        </div>

        <button onClick={handleGenerate} className={styles.quick_action} style={{marginTop:'var(--gap-md)', width: '100%'}}>
            Generar Fixture Automático
        </button>
      </section>

      {conflictos.length > 0 && (
        <section className={pageStyles.conflict_box}>
          <h3><AlertTriangle size={18} /> Conflictos Detectados</h3>
          <ul>
            {conflictos.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </section>
      )}

      <section className={pageStyles.list_section}>
        <h2>Partidos Programados</h2>
        <div className={pageStyles.matches_grid}>
            {partidos.map(p => (
                <div key={p.id} className={pageStyles.match_card}>
                    <div className={pageStyles.match_time}>
                        <Clock size={14} /> {p.fecha} - {p.hora.substring(0,5)}
                    </div>
                    <div className={pageStyles.match_teams}>
                        <span>{p.equipo_a?.nombre}</span>
                        <span className={pageStyles.vs}>VS</span>
                        <span>{p.equipo_b?.nombre}</span>
                    </div>
                    <div className={pageStyles.match_footer}>
                        {p.categorias?.nombre} | {p.lugar}
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
}
