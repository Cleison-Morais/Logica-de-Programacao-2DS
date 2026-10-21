-- ============================================================
--  CÓDIGO ARCADE – BANCO DE DADOS (Supabase / PostgreSQL)
--  Cole tudo no Supabase: SQL Editor → New query → Run.
--  Pode rodar de novo sem problema (é "idempotente").
--
--  Segurança:
--   • Os alunos NÃO acessam as tabelas diretamente. Tudo passa por
--     funções (RPC) que conferem a senha ou o token da sessão.
--   • A senha é guardada embaralhada (bcrypt), nunca em texto.
--   • Depois de 5 senhas erradas, a conta fica bloqueada 10 minutos.
--   • Preços dos móveis e moedas são controlados aqui no banco
--     (o aluno não consegue "criar" moedas pelo navegador).
--   • O painel do professor usa login do Supabase (e-mail e senha)
--     e só funciona para quem estiver na tabela "professores".
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

-- ------------------------------------------------------------
-- TABELAS
-- ------------------------------------------------------------
create table if not exists public.turmas (
  id         bigint generated always as identity primary key,
  nome       text not null unique,
  ativa      boolean not null default true,
  criado_em  timestamptz not null default now()
);

create table if not exists public.alunos (
  id             uuid primary key default gen_random_uuid(),
  turma_id       bigint not null references public.turmas(id) on delete cascade,
  nome           text not null,
  nick           text,
  nick_chave     text,
  email          text,
  senha_hash     text,
  avatar         jsonb not null default '{}'::jsonb,
  moedas         int  not null default 100 check (moedas >= 0),
  inventario     jsonb not null default '{}'::jsonb,
  quarto         jsonb not null default '{"piso":0,"parede":0,"itens":[]}'::jsonb,
  falhas         int not null default 0,
  bloqueado_ate  timestamptz,
  criado_em      timestamptz not null default now(),
  ultimo_acesso  timestamptz not null default now()
);
-- (para quem rodou a versão antiga do arquivo)
alter table public.alunos add column if not exists nick text;
alter table public.alunos add column if not exists nick_chave text;
alter table public.alunos add column if not exists email text;
alter table public.alunos add column if not exists senha_hash text;
alter table public.alunos add column if not exists moedas int not null default 100;
alter table public.alunos add column if not exists inventario jsonb not null default '{}'::jsonb;
alter table public.alunos add column if not exists quarto jsonb not null default '{"piso":0,"parede":0,"itens":[]}'::jsonb;
alter table public.alunos drop column if exists pin_hash;
alter table public.alunos drop column if exists nome_chave;
create unique index if not exists alunos_nick_un  on public.alunos (nick_chave);
create unique index if not exists alunos_email_un on public.alunos (lower(email));

create table if not exists public.sessoes (
  token      uuid primary key default gen_random_uuid(),
  aluno_id   uuid not null references public.alunos(id) on delete cascade,
  criado_em  timestamptz not null default now()
);

create table if not exists public.progresso (
  aluno_id       uuid not null references public.alunos(id) on delete cascade,
  fase_id        text not null,
  estrelas       int  not null check (estrelas between 0 and 3),
  xp             int  not null default 0 check (xp between 0 and 5000),
  tentativas     int  not null default 1,
  atualizado_em  timestamptz not null default now(),
  primary key (aluno_id, fase_id)
);

create table if not exists public.moveis (
  id     text primary key,
  nome   text not null,
  preco  int  not null check (preco >= 0),
  ativo  boolean not null default true
);

create table if not exists public.professores (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  nome     text
);

alter table public.turmas      enable row level security;
alter table public.alunos      enable row level security;
alter table public.sessoes     enable row level security;
alter table public.progresso   enable row level security;
alter table public.moveis      enable row level security;
alter table public.professores enable row level security;
revoke all on public.turmas, public.alunos, public.sessoes, public.progresso, public.moveis, public.professores from anon, authenticated;

-- Catálogo de móveis (o desenho de cada um está em js/moveis.js; o id precisa ser igual)
insert into public.moveis (id, nome, preco) values
  ('planta', 'Planta', 30), ('pufe', 'Pufe', 35), ('cadeira', 'Cadeira', 40), ('tapete', 'Tapete', 40),
  ('abajur', 'Abajur', 50), ('mesa', 'Mesa', 60), ('estante', 'Estante de livros', 90), ('sofa', 'Sofá', 120),
  ('cama', 'Cama', 150), ('tv', 'TV', 160), ('mesa_pc', 'PC gamer', 200), ('aquario', 'Aquário', 220),
  ('arcade', 'Fliperama', 300), ('trofeu', 'Troféu de ouro', 400)
on conflict (id) do update set nome = excluded.nome, preco = excluded.preco;

-- Remove funções da versão antiga (mudaram de assinatura)
drop function if exists public.entrar(bigint, text, text, boolean);
drop function if exists public.admin_resetar_pin(uuid);
drop function if exists public.nome_chave(text);

-- ------------------------------------------------------------
-- AUXILIARES
-- ------------------------------------------------------------
create or replace function public.aluno_da_sessao(p_token uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  select aluno_id into v from sessoes where token = p_token and criado_em > now() - interval '60 days';
  if v is null then raise exception 'sessao_invalida'; end if;
  return v;
end $$;

create or replace function public.progresso_json(p_aluno uuid)
returns json language sql stable security definer set search_path = public as $$
  select coalesce(json_object_agg(fase_id, json_build_object('estrelas', estrelas, 'xp', xp)), '{}'::json)
  from progresso where aluno_id = p_aluno
$$;

create or replace function public.perfil_json(p_aluno uuid)
returns json language sql stable security definer set search_path = public as $$
  select json_build_object('id', a.id, 'nome', a.nome, 'nick', a.nick, 'email', a.email, 'turma_id', a.turma_id, 'turma', t.nome,
                           'avatar', a.avatar, 'moedas', a.moedas, 'inventario', a.inventario, 'quarto', a.quarto,
                           'progresso', progresso_json(a.id))
  from alunos a join turmas t on t.id = a.turma_id where a.id = p_aluno
$$;

create or replace function public.nova_sessao(p_aluno uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  delete from sessoes where aluno_id = p_aluno and criado_em < now() - interval '60 days';
  insert into sessoes (aluno_id) values (p_aluno) returning token into v;
  update alunos set ultimo_acesso = now() where id = p_aluno;
  return v;
end $$;

create or replace function public.eh_professor()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from professores where user_id = auth.uid())
$$;

-- ------------------------------------------------------------
-- CONTA DO ALUNO
-- ------------------------------------------------------------
create or replace function public.listar_turmas()
returns json language sql stable security definer set search_path = public as $$
  select coalesce(json_agg(json_build_object('id', id, 'nome', nome) order by nome), '[]'::json) from turmas where ativa
$$;

create or replace function public.cadastrar(p_turma bigint, p_nome text, p_nick text, p_email text, p_senha text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_nome  text := initcap(regexp_replace(trim(coalesce(p_nome, '')), '\s+', ' ', 'g'));
  v_nick  text := trim(coalesce(p_nick, ''));
  v_email text := lower(trim(coalesce(p_email, '')));
  v_id    uuid;
begin
  if position(' ' in v_nome) = 0 or length(v_nome) > 60 then return json_build_object('ok', false, 'erro', 'nome'); end if;
  if v_nick !~ '^[A-Za-z0-9_.]{3,16}$' then return json_build_object('ok', false, 'erro', 'nick'); end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(v_email) > 120 then return json_build_object('ok', false, 'erro', 'email'); end if;
  if length(coalesce(p_senha, '')) < 6 or length(p_senha) > 72 then return json_build_object('ok', false, 'erro', 'senha'); end if;
  if not exists (select 1 from turmas where id = p_turma and ativa) then return json_build_object('ok', false, 'erro', 'turma'); end if;
  if exists (select 1 from alunos where nick_chave = lower(v_nick)) then return json_build_object('ok', false, 'erro', 'nick_existe'); end if;
  if exists (select 1 from alunos where lower(email) = v_email) then return json_build_object('ok', false, 'erro', 'email_existe'); end if;
  insert into alunos (turma_id, nome, nick, nick_chave, email, senha_hash)
  values (p_turma, v_nome, v_nick, lower(v_nick), v_email, crypt(p_senha, gen_salt('bf', 8)))
  returning id into v_id;
  return json_build_object('ok', true, 'novo', true, 'token', nova_sessao(v_id), 'aluno', perfil_json(v_id));
end $$;

-- p_login pode ser o nickname OU o e-mail
create or replace function public.entrar(p_login text, p_senha text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare a alunos%rowtype; v text := lower(trim(coalesce(p_login, '')));
begin
  select * into a from alunos where nick_chave = v or lower(email) = v limit 1;
  if not found then return json_build_object('ok', false, 'erro', 'login'); end if;
  if a.bloqueado_ate is not null and a.bloqueado_ate > now() then
    return json_build_object('ok', false, 'erro', 'bloqueado', 'minutos', ceil(extract(epoch from a.bloqueado_ate - now()) / 60));
  end if;
  if a.senha_hash is null then
    -- senha foi resetada pelo professor: a senha digitada agora vira a nova
    if length(coalesce(p_senha, '')) < 6 then return json_build_object('ok', false, 'erro', 'senha'); end if;
    update alunos set senha_hash = crypt(p_senha, gen_salt('bf', 8)) where id = a.id;
  elsif crypt(coalesce(p_senha, ''), a.senha_hash) <> a.senha_hash then
    update alunos set falhas = falhas + 1,
                      bloqueado_ate = case when falhas + 1 >= 5 then now() + interval '10 minutes' else null end
      where id = a.id;
    update alunos set falhas = 0 where id = a.id and bloqueado_ate is not null;
    return json_build_object('ok', false, 'erro', 'login');
  end if;
  update alunos set falhas = 0, bloqueado_ate = null where id = a.id;
  return json_build_object('ok', true, 'novo', false, 'token', nova_sessao(a.id), 'aluno', perfil_json(a.id));
end $$;

create or replace function public.trocar_senha(p_token uuid, p_atual text, p_nova text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare v_aluno uuid := aluno_da_sessao(p_token); h text;
begin
  select senha_hash into h from alunos where id = v_aluno;
  if crypt(coalesce(p_atual, ''), h) <> h then return json_build_object('ok', false, 'erro', 'senha_atual'); end if;
  if length(coalesce(p_nova, '')) < 6 or length(p_nova) > 72 then return json_build_object('ok', false, 'erro', 'senha'); end if;
  update alunos set senha_hash = crypt(p_nova, gen_salt('bf', 8)) where id = v_aluno;
  return json_build_object('ok', true);
end $$;

-- ------------------------------------------------------------
-- JOGO
-- ------------------------------------------------------------
-- Moedas: 10 por estrela NOVA + 20 na primeira vez que vence a fase.
create or replace function public.salvar_fase(p_token uuid, p_fase text, p_estrelas int, p_xp int)
returns json language plpgsql security definer set search_path = public as $$
declare v_aluno uuid := aluno_da_sessao(p_token); v_antes int; v_ganho int;
begin
  if p_fase !~ '^m[0-9]+f[0-9]+$' or p_estrelas not between 1 and 3 or p_xp not between 0 and 5000 then
    return json_build_object('ok', false, 'erro', 'dados');
  end if;
  select estrelas into v_antes from progresso where aluno_id = v_aluno and fase_id = p_fase;
  v_ganho := greatest(p_estrelas - coalesce(v_antes, 0), 0) * 10 + case when v_antes is null then 20 else 0 end;
  insert into progresso as pr (aluno_id, fase_id, estrelas, xp) values (v_aluno, p_fase, p_estrelas, p_xp)
  on conflict (aluno_id, fase_id) do update
    set estrelas = greatest(pr.estrelas, excluded.estrelas), xp = greatest(pr.xp, excluded.xp),
        tentativas = pr.tentativas + 1, atualizado_em = now();
  update alunos set moedas = moedas + v_ganho, ultimo_acesso = now() where id = v_aluno;
  return json_build_object('ok', true, 'ganhou', v_ganho, 'moedas', (select moedas from alunos where id = v_aluno), 'progresso', progresso_json(v_aluno));
end $$;

create or replace function public.salvar_avatar(p_token uuid, p_avatar jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare v_aluno uuid := aluno_da_sessao(p_token);
begin
  if jsonb_typeof(p_avatar) <> 'object' or length(p_avatar::text) > 2000 then return json_build_object('ok', false, 'erro', 'avatar'); end if;
  update alunos set avatar = p_avatar where id = v_aluno;
  return json_build_object('ok', true);
end $$;

create or replace function public.listar_moveis()
returns json language sql stable security definer set search_path = public as $$
  select coalesce(json_agg(json_build_object('id', id, 'nome', nome, 'preco', preco) order by preco), '[]'::json) from moveis where ativo
$$;

create or replace function public.comprar_movel(p_token uuid, p_movel text)
returns json language plpgsql security definer set search_path = public as $$
declare v_aluno uuid := aluno_da_sessao(p_token); v_preco int; v_moedas int;
begin
  select preco into v_preco from moveis where id = p_movel and ativo;
  if v_preco is null then return json_build_object('ok', false, 'erro', 'movel'); end if;
  select moedas into v_moedas from alunos where id = v_aluno for update;
  if v_moedas < v_preco then return json_build_object('ok', false, 'erro', 'moedas'); end if;
  update alunos set moedas = moedas - v_preco,
                    inventario = jsonb_set(inventario, array[p_movel], to_jsonb(coalesce((inventario->>p_movel)::int, 0) + 1))
    where id = v_aluno;
  return (select json_build_object('ok', true, 'moedas', moedas, 'inventario', inventario) from alunos where id = v_aluno);
end $$;

-- quarto = {"piso":0,"parede":0,"itens":[{"m":"cadeira","x":2,"y":3,"r":0}, ...]}
create or replace function public.salvar_quarto(p_token uuid, p_quarto jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare v_aluno uuid := aluno_da_sessao(p_token); v_inv jsonb; r record;
begin
  if jsonb_typeof(p_quarto) <> 'object' or jsonb_typeof(p_quarto->'itens') <> 'array' or length(p_quarto::text) > 6000 then
    return json_build_object('ok', false, 'erro', 'quarto');
  end if;
  select inventario into v_inv from alunos where id = v_aluno;
  for r in select it->>'m' as m, count(*) as n from jsonb_array_elements(p_quarto->'itens') it group by 1 loop
    if coalesce((v_inv->>r.m)::int, 0) < r.n then return json_build_object('ok', false, 'erro', 'sem_movel', 'movel', r.m); end if;
  end loop;
  if exists (select 1 from jsonb_array_elements(p_quarto->'itens') it
             where (it->>'x')::int not between 0 and 9 or (it->>'y')::int not between 0 and 9) then
    return json_build_object('ok', false, 'erro', 'posicao');
  end if;
  update alunos set quarto = p_quarto where id = v_aluno;
  return json_build_object('ok', true);
end $$;

create or replace function public.ver_quarto(p_nick text)
returns json language sql stable security definer set search_path = public as $$
  select coalesce((select json_build_object('ok', true, 'nick', nick, 'avatar', avatar, 'quarto', quarto)
                   from alunos where nick_chave = lower(trim(p_nick))), json_build_object('ok', false))
$$;

create or replace function public.ranking(p_turma bigint)
returns json language sql stable security definer set search_path = public as $$
  select coalesce(json_agg(r order by r.estrelas desc, r.xp desc, r.nick), '[]'::json) from (
    select a.nick, a.avatar,
           coalesce(sum(p.estrelas), 0)::int as estrelas, coalesce(sum(p.xp), 0)::int as xp,
           count(p.fase_id) filter (where p.estrelas > 0)::int as fases
    from alunos a left join progresso p on p.aluno_id = a.id
    where a.turma_id = p_turma group by a.id
  ) r
$$;

-- ------------------------------------------------------------
-- PAINEL DO PROFESSOR (precisa estar logado)
-- ------------------------------------------------------------
create or replace function public.admin_turmas()
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not eh_professor() then raise exception 'sem_permissao'; end if;
  return (select coalesce(json_agg(json_build_object('id', t.id, 'nome', t.nome, 'ativa', t.ativa,
            'alunos', (select count(*) from alunos a where a.turma_id = t.id)) order by t.nome), '[]'::json) from turmas t);
end $$;

create or replace function public.admin_criar_turma(p_nome text)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not eh_professor() then raise exception 'sem_permissao'; end if;
  if length(trim(coalesce(p_nome, ''))) < 2 then return json_build_object('ok', false, 'erro', 'nome'); end if;
  insert into turmas (nome) values (trim(p_nome)) on conflict (nome) do update set ativa = true;
  return json_build_object('ok', true);
end $$;

create or replace function public.admin_ativar_turma(p_turma bigint, p_ativa boolean)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not eh_professor() then raise exception 'sem_permissao'; end if;
  update turmas set ativa = p_ativa where id = p_turma;
  return json_build_object('ok', true);
end $$;

create or replace function public.admin_listar(p_turma bigint default null)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not eh_professor() then raise exception 'sem_permissao'; end if;
  return (select coalesce(json_agg(r order by r.turma, r.nome), '[]'::json) from (
    select a.id, a.nome, a.nick, a.email, t.nome as turma, a.turma_id, a.avatar, a.moedas, a.ultimo_acesso, a.criado_em,
           (a.senha_hash is null) as sem_senha,
           (a.bloqueado_ate is not null and a.bloqueado_ate > now()) as bloqueado,
           coalesce((select sum(estrelas) from progresso p where p.aluno_id = a.id), 0)::int as estrelas,
           coalesce((select sum(xp) from progresso p where p.aluno_id = a.id), 0)::int as xp,
           progresso_json(a.id) as progresso
    from alunos a join turmas t on t.id = a.turma_id
    where p_turma is null or a.turma_id = p_turma
  ) r);
end $$;

create or replace function public.admin_resetar_senha(p_aluno uuid)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not eh_professor() then raise exception 'sem_permissao'; end if;
  update alunos set senha_hash = null, falhas = 0, bloqueado_ate = null where id = p_aluno;
  delete from sessoes where aluno_id = p_aluno;
  return json_build_object('ok', true);
end $$;

create or replace function public.admin_dar_moedas(p_aluno uuid, p_qtd int)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not eh_professor() then raise exception 'sem_permissao'; end if;
  if p_qtd not between -10000 and 10000 then return json_build_object('ok', false, 'erro', 'qtd'); end if;
  update alunos set moedas = greatest(moedas + p_qtd, 0) where id = p_aluno;
  return json_build_object('ok', true);
end $$;

create or replace function public.admin_apagar_aluno(p_aluno uuid)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not eh_professor() then raise exception 'sem_permissao'; end if;
  delete from alunos where id = p_aluno;
  return json_build_object('ok', true);
end $$;

-- ------------------------------------------------------------
-- PERMISSÕES
-- ------------------------------------------------------------
revoke all on all functions in schema public from public, anon, authenticated;
grant execute on function public.listar_turmas()                                 to anon, authenticated;
grant execute on function public.cadastrar(bigint, text, text, text, text)       to anon, authenticated;
grant execute on function public.entrar(text, text)                              to anon, authenticated;
grant execute on function public.trocar_senha(uuid, text, text)                  to anon, authenticated;
grant execute on function public.salvar_fase(uuid, text, int, int)               to anon, authenticated;
grant execute on function public.salvar_avatar(uuid, jsonb)                      to anon, authenticated;
grant execute on function public.listar_moveis()                                 to anon, authenticated;
grant execute on function public.comprar_movel(uuid, text)                       to anon, authenticated;
grant execute on function public.salvar_quarto(uuid, jsonb)                      to anon, authenticated;
grant execute on function public.ver_quarto(text)                                to anon, authenticated;
grant execute on function public.ranking(bigint)                                 to anon, authenticated;
grant execute on function public.admin_turmas()                                  to authenticated;
grant execute on function public.admin_criar_turma(text)                         to authenticated;
grant execute on function public.admin_ativar_turma(bigint, boolean)             to authenticated;
grant execute on function public.admin_listar(bigint)                            to authenticated;
grant execute on function public.admin_resetar_senha(uuid)                       to authenticated;
grant execute on function public.admin_dar_moedas(uuid, int)                     to authenticated;
grant execute on function public.admin_apagar_aluno(uuid)                        to authenticated;

-- ------------------------------------------------------------
-- TURMAS INICIAIS (pode mudar depois pelo painel do professor)
-- ------------------------------------------------------------
insert into public.turmas (nome) values ('2º DS – Paulo Kobayashi'), ('2º DS – Ferraz')
on conflict (nome) do nothing;

-- ------------------------------------------------------------
-- DEPOIS DE CRIAR SEU USUÁRIO (Authentication → Users → Add user),
-- rode a linha abaixo trocando o e-mail para virar professor:
--
-- insert into public.professores (user_id, nome)
-- select id, 'Prof. Cleison' from auth.users where email = 'SEU_EMAIL_AQUI'
-- on conflict do nothing;
-- ------------------------------------------------------------
