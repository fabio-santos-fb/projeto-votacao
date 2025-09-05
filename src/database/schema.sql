-- Habilitar extensão para gerar UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cpf VARCHAR(11) UNIQUE NOT NULL,
    tipo VARCHAR(10) NOT NULL
);

-- Criar tabela pautas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS pautas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) UNIQUE NOT NULL,
    descricao TEXT,
    tempo_aberta INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pautas_updated_at
BEFORE UPDATE ON pautas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela votos
CREATE TABLE IF NOT EXISTS votos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cpf VARCHAR(11) NOT NULL,
    pauta_id UUID NOT NULL REFERENCES pautas(id) ON DELETE CASCADE,
    voto VARCHAR(3) NOT NULL CHECK (voto IN ('sim', 'nao')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (cpf, pauta_id)
);
