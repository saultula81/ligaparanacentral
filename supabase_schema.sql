-- Esquema de base de datos para Liga de Volley Paraná Central

-- 1. Categorías
CREATE TABLE categorias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Equipos
CREATE TABLE equipos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    escudo_url TEXT,
    categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
    rama TEXT CHECK (rama IN ('Femenina', 'Masculina', 'Mixta')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Jugadores
CREATE TABLE jugadores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Relación Jugadores-Equipos (Muchos a Muchos)
-- Permite que un jugador esté en varios equipos de diferentes categorías
CREATE TABLE jugadores_equipos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
    equipo_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
    UNIQUE(jugador_id, equipo_id)
);

-- 5. Partidos (Fixture)
CREATE TABLE partidos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    equipo_a_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
    equipo_b_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
    categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    lugar TEXT NOT NULL,
    finalizado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Resultados
CREATE TABLE resultados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE UNIQUE,
    sets_a JSONB NOT NULL, -- Ej: [25, 19, 15]
    sets_b JSONB NOT NULL, -- Ej: [22, 25, 12]
    ganador_id UUID REFERENCES equipos(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar categorías iniciales
INSERT INTO categorias (nombre) VALUES 
('Mayores'), ('Sub 19'), ('Sub 17'), ('Sub 15'), ('Sub 13'), ('Sub 12');
