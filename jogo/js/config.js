// ============================================================
//  CONFIGURAÇÃO – Código Arcade
//  Cole aqui os dados do seu projeto Supabase:
//  Supabase → Project Settings → API (ou "Data API")
//    • Project URL      → SUPABASE_URL
//    • anon public key  → SUPABASE_ANON_KEY
//  A chave "anon" pode ficar no código: quem protege os dados são
//  as regras do banco (arquivo supabase/schema.sql).
//  NUNCA coloque aqui a chave "service_role".
//
//  Com os dois campos vazios, o jogo roda no MODO OFFLINE
//  (salva só no navegador do computador).
// ============================================================
window.CONFIG = {
  SUPABASE_URL: "https://chyfxtgpagbsarskuhkt.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoeWZ4dGdwYWdic2Fyc2t1aGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MTI2MzUsImV4cCI6MjEwODE4ODYzNX0.1B0bGAyRaCte1egwJ5YfOhvPO_TPgWUBjuZEGqTY13E",

  // E-mail aceito no cadastro (deixe "" para aceitar qualquer e-mail)
  DOMINIO_EMAIL: "al.educacao.sp.gov.br",

  // Turmas usadas só no modo offline (no modo online elas vêm do banco)
  TURMAS_OFFLINE: ["2º DS – Paulo Kobayashi", "2º DS – Ferraz"],

  NOME_DO_JOGO: "CÓDIGO ARCADE",
  PROFESSOR: "Prof. Cleison de Morais Mello"
};
