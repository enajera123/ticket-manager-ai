create schema if not exists ia_structure;
-- Otorgar permisos al esquema
GRANT USAGE ON SCHEMA ticket_manager TO anon, authenticated, service_role;

-- Otorgar permisos a todas las tablas existentes
GRANT ALL ON ALL TABLES IN SCHEMA ticket_manager TO anon, authenticated, service_role;

-- Otorgar permisos a todas las secuencias (para autoincrement)
GRANT ALL ON ALL SEQUENCES IN SCHEMA ticket_manager TO anon, authenticated, service_role;

-- Otorgar permisos automáticamente a tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA ticket_manager 
GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA ticket_manager 
GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;