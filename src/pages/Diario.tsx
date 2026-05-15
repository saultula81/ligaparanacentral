import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import styles from "./Diario.module.css";
import { MessageCircle, Trophy, Calendar, ExternalLink, Search, User } from "lucide-react";

export default function Diario() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [proximos, setProximos] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Pestañas: cronicas, buscar, calendario
  const [activeTab, setActiveTab] = useState<'cronicas' | 'buscar' | 'calendario'>('cronicas');
  const [players, setPlayers] = useState<any[]>([]);
  const [allUpcomingMatches, setAllUpcomingMatches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAdmin(!!session);
  }

  async function fetchData() {
    try {
      setLoadingSearch(true);
      // 1. Noticias del feed
      const { data: resultsData } = await supabase
        .from('partidos')
        .select(`
          id, fecha, hora,
          equipo_a:equipos!equipo_a_id(nombre, escudo_url),
          equipo_b:equipos!equipo_b_id(nombre, escudo_url),
          categorias(nombre),
          resultados(sets_a, sets_b, ganador_id, cronica, foto_url)
        `)
        .eq('finalizado', true)
        .order('fecha', { ascending: false });
      
      setNoticias(resultsData || []);

      // 2. Próximos partidos (Sidebar limit 5)
      const { data: fixtureData } = await supabase
        .from('partidos')
        .select(`
          id, fecha, hora, lugar,
          equipo_a:equipos!equipo_a_id(nombre, escudo_url),
          equipo_b:equipos!equipo_b_id(nombre, escudo_url),
          categorias(nombre)
        `)
        .eq('finalizado', false)
        .order('fecha', { ascending: true })
        .limit(5);

      setProximos(fixtureData || []);

      // 3. Jugadores y sus equipos para la búsqueda pública
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

      // 4. Todos los partidos futuros sin límite (Para la pestaña Calendario)
      const { data: allMatches } = await supabase
        .from('partidos')
        .select('*, equipo_a:equipos!equipo_a_id(nombre, escudo_url), equipo_b:equipos!equipo_b_id(nombre, escudo_url), categorias(nombre)')
        .eq('finalizado', false)
        .order('fecha')
        .order('hora');
      setAllUpcomingMatches(allMatches || []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSearch(false);
    }
  }

  const handleShareWhatsApp = (noticia: any) => {
    const setsA = noticia.resultados?.sets_a || [];
    const setsB = noticia.resultados?.sets_b || [];
    const scoreA = setsA.filter((s:any, i:any) => s > setsB[i]).length;
    const scoreB = setsB.filter((s:any, i:any) => s > setsA[i]).length;
    
    const text = `*Resultados Liga Parana Central* 🏐\n\n${noticia.equipo_a.nombre} *${scoreA} - ${scoreB}* ${noticia.equipo_b.nombre}\n\n"${noticia.resultados?.cronica?.substring(0, 50)}..."\n\nMás info en nuestra App oficial.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredPlayers = players.filter(p => 
    searchTerm.trim() !== "" && (
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.dni.includes(searchTerm)
    )
  );

  return (
    <div className={styles.diario_container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebar__brand}>
          <img src="/liga.png" alt="Logo" />
          <div>
            <h1>LIGA CENTRAL</h1>
            <span>DIARIO DIGITAL</span>
          </div>
        </div>

        <nav className={styles.sidebar__nav}>
          <div 
            onClick={() => setActiveTab('cronicas')}
            className={`${styles.nav_item} ${activeTab === 'cronicas' ? styles['nav_item--active'] : ''}`}
          >
            <Trophy size={20} /> <span>Crónicas</span>
          </div>
          <div 
            onClick={() => setActiveTab('calendario')}
            className={`${styles.nav_item} ${activeTab === 'calendario' ? styles['nav_item--active'] : ''}`}
          >
            <Calendar size={20} /> <span>Calendario</span>
          </div>
          <div 
            onClick={() => setActiveTab('buscar')}
            className={`${styles.nav_item} ${activeTab === 'buscar' ? styles['nav_item--active'] : ''}`}
          >
            <Search size={20} /> <span>Buscar Jugador</span>
          </div>
          
          {isAdmin && (
            <div 
              onClick={() => navigate('/admin')} 
              className={styles.nav_item} 
              style={{marginTop: '10px', border: '1px solid var(--primary)', color: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)'}}
            >
              <ExternalLink size={20} /> <span>Volver al Panel</span>
            </div>
          )}
        </nav>

        <div className={styles.sidebar__box}>
            <h3 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '15px', textTransform: 'uppercase'}}>Próximos Partidos</h3>
            {proximos.length === 0 ? <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>No hay partidos programados</p> : 
             proximos.map(p => (
                <div key={p.id} className={styles.mini_fixture}>
                    <span style={{fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700}}>{p.fecha} | {p.hora?.substring(0,5)}</span>
                    <p style={{margin: '5px 0 0', fontSize: '0.85rem', fontWeight: 600}}>{p.equipo_a.nombre} vs {p.equipo_b.nombre}</p>
                </div>
            ))}
        </div>
      </aside>

      <main className={styles.content}>
        {activeTab === 'cronicas' ? (
          <>
            <header className={styles.content__header}>
                <h2>Resumen de la Fecha</h2>
                <div className={styles.header_stats}>
                    <div className={styles.stat_card}>
                        <strong>{noticias.length}</strong>
                        <span>Partidos Jugados</span>
                    </div>
                </div>
            </header>

            <div className={styles.feed}>
              {noticias.map(noticia => {
                const setsA = noticia.resultados?.sets_a || [];
                const setsB = noticia.resultados?.sets_b || [];
                const scoreA = setsA.filter((s:any, i:any) => s > setsB[i]).length;
                const scoreB = setsB.filter((s:any, i:any) => s > setsA[i]).length;

                return (
                  <article key={noticia.id} className={styles.news_card}>
                    <div className={styles.news_card__image}>
                      <img 
                        src={noticia.resultados?.foto_url || '/volley.png'} 
                        alt="Partido" 
                        onError={(e) => { (e.target as HTMLImageElement).src = '/volley.png'; }}
                      />
                      <div className={styles.category_tag}>{noticia.categorias?.nombre}</div>
                    </div>

                    <div className={styles.news_card__body}>
                      <div className={styles.score_row}>
                        <div className={styles.team}>
                          <img src={noticia.equipo_a.escudo_url || '/ligaayb.png'} alt="" />
                          <span>{noticia.equipo_a.nombre}</span>
                        </div>
                        <div className={styles.score_display}>
                          {scoreA} - {scoreB}
                        </div>
                        <div className={styles.team}>
                          <img src={noticia.equipo_b.escudo_url || '/ligavyj.png'} alt="" />
                          <span>{noticia.equipo_b.nombre}</span>
                        </div>
                      </div>

                      <p className={styles.cronica_text}>
                        {noticia.resultados?.cronica || "Sin crónica disponible para este encuentro."}
                      </p>

                      <div className={styles.card_footer}>
                         <div className={styles.sets_row}>
                           {setsA.map((s:any, i:any) => (
                              <span key={i} className={styles.set_pill}>({s}-{setsB[i]})</span>
                           ))}
                         </div>
                         <div className={styles.actions}>
                            <button onClick={() => handleShareWhatsApp(noticia)} className={styles.share_btn} title="Compartir en WhatsApp">
                              <MessageCircle size={18} />
                            </button>
                            <button className={styles.share_btn} title="Ver detalle">
                              <ExternalLink size={18} />
                            </button>
                         </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : activeTab === 'calendario' ? (
          <div className={styles.calendario_container}>
             <header className={styles.content__header}>
                 <div className={styles.print_header}>
                   <img src="/liga.png" alt="Logo Liga" className={styles.print_logo} />
                   <h2>Fixture Oficial de la Liga</h2>
                 </div>
                 <button onClick={() => window.print()} className={styles.print_btn}>
                   🖨️ Imprimir Fixture
                 </button>
             </header>
             <div className={styles.fixture_full_grid}>
                {allUpcomingMatches.length === 0 ? (
                  <p className={styles.empty_state}>No hay partidos programados en el fixture oficial todavía.</p>
                ) : (
                  allUpcomingMatches.map(m => (
                    <div key={m.id} className={styles.fixture_full_card}>
                        <div className={styles.fixture_header}>
                            <span className={styles.fixture_cat}>{m.categorias?.nombre}</span>
                            <span className={styles.fixture_time}>{m.fecha} | {m.hora?.substring(0,5)} hs</span>
                        </div>
                        <div className={styles.fixture_body}>
                            <div className={styles.fixture_team}>
                                <img src={m.equipo_a.escudo_url || '/ligaayb.png'} alt="Equipo A" />
                                <span>{m.equipo_a.nombre}</span>
                            </div>
                            <div className={styles.fixture_vs}>VS</div>
                            <div className={styles.fixture_team}>
                                <img src={m.equipo_b.escudo_url || '/ligavyj.png'} alt="Equipo B" />
                                <span>{m.equipo_b.nombre}</span>
                            </div>
                        </div>
                        <div className={styles.fixture_footer}>
                            📍 Sede del Encuentro: <strong>{m.lugar || 'Cancha Central'}</strong>
                        </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        ) : (
          <div className={styles.search_container}>
            <header className={styles.content__header}>
                <h2>Buscador de Jugadores</h2>
            </header>

            <div className={styles.search_box}>
              <Search size={22} color="var(--primary)" />
              <input 
                type="text" 
                placeholder="Ingresa tu nombre o DNI para ver tus partidos..." 
                className={styles.search_input}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            {loadingSearch ? (
              <p className={styles.empty_state}>Cargando calendario oficial...</p>
            ) : searchTerm.trim() === "" ? (
              <div className={styles.empty_state}>
                <User size={48} style={{ opacity: 0.2, marginBottom: '15px' }} />
                <p>Escribe en el recuadro superior para ubicar instantáneamente tu ficha, equipos y horarios de juego.</p>
              </div>
            ) : filteredPlayers.length === 0 ? (
              <p className={styles.empty_state}>No se encontraron jugadores con ese nombre o DNI.</p>
            ) : (
              <div className={styles.results_grid}>
                {filteredPlayers.map(player => {
                  const playerTeamIds = player.jugadores_equipos?.map((rel: any) => rel.equipo_id) || [];
                  const playerMatches = allUpcomingMatches.filter(m => 
                    playerTeamIds.includes(m.equipo_a_id) || playerTeamIds.includes(m.equipo_b_id)
                  );

                  return (
                    <div key={player.id} className={styles.player_result_card}>
                      <div className={styles.player_header}>
                        <div>
                          <h3 className={styles.player_name}>{player.nombre}</h3>
                          <p className={styles.player_dni}>DNI: {player.dni}</p>
                        </div>
                        <span className={styles.status_badge}>HABILITADO</span>
                      </div>

                      <div className={styles.teams_section}>
                        <div className={styles.section_label}>Equipos en los que participa</div>
                        <div className={styles.teams_list}>
                          {player.jugadores_equipos?.map((rel: any, idx: number) => (
                            <span key={idx} className={styles.team_pill}>
                              {rel.equipos?.nombre} <small style={{color:'var(--primary)'}}>({rel.equipos?.categorias?.nombre})</small>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className={styles.matches_box}>
                        <div className={styles.matches_label}>
                          <Calendar size={14} /> PRÓXIMOS ENCUENTROS OFICIALES
                        </div>
                        {playerMatches.length === 0 ? (
                          <p className={styles.empty_state} style={{ padding: '10px 0', fontSize: '0.85rem' }}>
                            No tienes partidos pendientes en el fixture actual.
                          </p>
                        ) : (
                          playerMatches.map(m => (
                            <div key={m.id} className={styles.match_row}>
                              <div>
                                <span className={styles.match_versus}>{m.equipo_a.nombre} vs {m.equipo_b.nombre}</span>
                                <span className={styles.match_place}>{m.categorias?.nombre} | Lugar: {m.lugar || 'Cancha Central'}</span>
                              </div>
                              <div className={styles.match_details}>
                                <strong>{m.fecha}</strong>
                                <div>Hora: {m.hora?.substring(0, 5)}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
