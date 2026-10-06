# 🗄️ Esquema de Base de Datos — TuzosJrz

**Este documento es para Genspark Code / el desarrollador.**
Define las tablas de Supabase necesarias para que la app funcione.

---

## 🎯 Overview

**Stack recomendado**: Supabase (PostgreSQL) + Row Level Security (RLS)

**Convenciones**:
- Todos los IDs son `UUID` con default `gen_random_uuid()`
- Timestamps en formato `timestamptz` con default `now()`
- Snake_case para columnas
- Foreign keys con `on delete cascade` cuando es dependencia lógica

---

## 📋 TABLAS

### `profiles`
Extensión de `auth.users` de Supabase. Se crea automáticamente al registrarse.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'coach', 'parent')),
  name text not null,
  phone text,
  email text unique,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### `players` (jugadores)
```sql
create table players (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  category text not null,       -- 'Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-16'
  position text,                 -- 'POR', 'DFC', 'MC', 'DC', etc.
  jersey_number int,
  birth_date date not null,
  photo_url text,
  status text default 'active',  -- 'active', 'suspended', 'inactive'
  monthly_fee int default 850,
  created_at timestamptz default now()
);

create index idx_players_category on players(category);
```

### `player_parents` (relación jugador ↔ tutor, muchos-a-muchos)
```sql
create table player_parents (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  parent_id uuid references profiles(id) on delete cascade,
  relation text,                 -- 'Padre', 'Madre', 'Tutor'
  is_primary boolean default false,
  can_edit_medical boolean default false,
  created_at timestamptz default now(),
  unique(player_id, parent_id)
);
```

### `medical_records`
```sql
create table medical_records (
  player_id uuid primary key references players(id) on delete cascade,
  status text default 'apto',    -- 'apto', 'recuperacion', 'lesionado'
  height_cm int,
  weight_kg int,
  blood_type text,
  allergies text,
  medication text,
  last_checkup date,
  emergency_contact_name text,
  emergency_contact_phone text,
  fisio_notes text,
  updated_at timestamptz default now(),
  updated_by uuid references profiles(id)
);

create table injuries (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  date date not null,
  type text not null,
  notes text,
  recovery_status text,
  created_at timestamptz default now()
);
```

### `coaches_categories` (asignación coach → categorías)
```sql
create table coaches_categories (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid references profiles(id) on delete cascade,
  category text not null,
  is_primary boolean default false,
  created_at timestamptz default now(),
  unique(coach_id, category)
);
```

### `events` (partidos, entrenamientos, torneos, reuniones)
```sql
create table events (
  id uuid primary key default gen_random_uuid(),
  type text not null,            -- 'match', 'friendly', 'training', 'meeting'
  category text,
  title text,
  rival text,                    -- solo si es partido
  date date,
  match_time time,
  call_time time,
  date_time timestamptz,         -- si no es partido (usa esto)
  half_length_min int default 25,
  location jsonb,                -- { name, address, lat, lng }
  uniform text,                  -- 'local' | 'away'
  notes text,
  status text default 'scheduled', -- 'scheduled', 'modified', 'cancelled', 'in_progress', 'finished'
  cancel_reason text,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_events_date on events(date);
create index idx_events_category on events(category);
create index idx_events_status on events(status);
```

### `event_history` (audit log para el diff de cambios)
```sql
create table event_history (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  kind text not null,            -- 'created', 'edited', 'cancelled', 'reactivated'
  changes jsonb,                 -- diff completo con from/to
  reason text,
  summary text,
  changed_by uuid references profiles(id),
  changed_at timestamptz default now()
);

create index idx_event_history_event on event_history(event_id);
```

### `event_convocatoria` (jugadores convocados a un partido)
```sql
create table event_convocatoria (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  parent_confirmed text,         -- null | 'yes' | 'no' | 'late'
  is_snack_provider boolean default false,
  created_at timestamptz default now(),
  unique(event_id, player_id)
);
```

### `attendance` (registro de asistencia por evento)
```sql
create table attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  mark text not null,            -- 'P' (presente), 'A' (ausente), 'J' (justificado)
  notes text,
  recorded_by uuid references profiles(id),
  recorded_at timestamptz default now(),
  unique(event_id, player_id)
);
```

### `payments`
```sql
create table payments (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  parent_id uuid references profiles(id),
  concept text not null,         -- 'monthly_fee', 'uniform', 'tournament', etc.
  amount int not null,           -- centavos MXN (ej: 85000 = $850)
  currency text default 'MXN',
  status text default 'pending', -- 'pending', 'paid', 'rejected', 'refunded'
  method text,                   -- 'card', 'spei', 'cash', 'transfer'
  reference text,                -- referencia SPEI o ID Stripe
  receipt_url text,              -- comprobante subido
  paid_at timestamptz,
  approved_by uuid references profiles(id),
  created_at timestamptz default now()
);

create index idx_payments_player on payments(player_id);
create index idx_payments_status on payments(status);
```

### `match_events` (goles, tarjetas, faltas en vivo)
```sql
create table match_events (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  player_id uuid references players(id),
  type text not null,            -- 'goal-us', 'goal-them', 'yellow', 'red', 'foul', 'kickoff', 'halftime', 'fulltime'
  minute int,
  comment text,
  recorded_at timestamptz default now(),
  recorded_by uuid references profiles(id)
);

create index idx_match_events_event on match_events(event_id);
```

### `match_states` (estado actual del partido en vivo)
```sql
create table match_states (
  event_id uuid primary key references events(id) on delete cascade,
  phase text default 'pre',      -- 'pre', '1t', 'halftime', '2t', 'finished'
  home_score int default 0,
  away_score int default 0,
  running_since timestamptz,
  elapsed_ms bigint default 0,
  half_length_min int default 25,
  started_at timestamptz,
  updated_at timestamptz default now()
);
```

### `player_stats` (estadísticas acumuladas)
```sql
create table player_stats (
  player_id uuid primary key references players(id) on delete cascade,
  goals int default 0,
  yellows int default 0,
  reds int default 0,
  fouls int default 0,
  minutes_played int default 0,
  matches_played int default 0,
  updated_at timestamptz default now()
);
```

### `chats` (grupos y DMs)
```sql
create table chats (
  id uuid primary key default gen_random_uuid(),
  kind text not null,            -- 'group', 'direct', 'announce'
  title text,
  category text,                 -- solo si es grupo de categoría
  created_at timestamptz default now()
);

create table chat_members (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text,                     -- 'admin', 'member'
  unique(chat_id, user_id)
);

create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  sender_id uuid references profiles(id),
  text text,
  attachments jsonb,             -- [{type, url, filename}]
  is_system boolean default false, -- true para mensajes automáticos del sistema
  pinned boolean default false,
  created_at timestamptz default now()
);

create table message_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references chat_messages(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  emoji text not null,
  created_at timestamptz default now(),
  unique(message_id, user_id, emoji)
);

create index idx_messages_chat on chat_messages(chat_id, created_at desc);
```

### `documents` (fichas del jugador)
```sql
create table documents (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  kind text not null,            -- 'ine', 'birth_cert', 'medical', 'photo', 'tutor_auth', 'free'
  custom_name text,              -- solo si kind='free'
  file_url text not null,
  file_type text,                -- 'pdf', 'image'
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  expires_at date,
  uploaded_by uuid references profiles(id),
  uploaded_at timestamptz default now(),
  approved_by uuid references profiles(id),
  approved_at timestamptz
);

create index idx_documents_player on documents(player_id);
create index idx_documents_status on documents(status);
```

### `notifications`
```sql
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  kind text not null,            -- 'payment', 'event', 'chat', 'medical', 'document', 'match-goal', 'match-final'
  title text not null,
  body text,
  data jsonb,                    -- payload extra (event_id, chat_id, etc)
  read_at timestamptz,
  created_at timestamptz default now()
);

create index idx_notifications_user on notifications(user_id, created_at desc);
```

### `snacks_rotation`
```sql
create table snacks_rotation (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  event_id uuid references events(id),
  player_id uuid references players(id),
  status text default 'assigned', -- 'assigned', 'confirmed', 'skipped', 'delivered'
  scheduled_date date,
  created_at timestamptz default now()
);
```

---

## 🔒 Row Level Security (RLS) — Ejemplos

### Padres solo ven a sus propios hijos

```sql
create policy "Parents see their kids"
  on players for select
  using (
    exists (
      select 1 from player_parents pp
      where pp.player_id = players.id
        and pp.parent_id = auth.uid()
    )
    or exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'coach')
    )
  );
```

### Coaches solo ven jugadores de sus categorías

```sql
create policy "Coaches see their category"
  on players for select
  using (
    exists (
      select 1 from coaches_categories cc
      where cc.coach_id = auth.uid()
        and cc.category = players.category
    )
    or exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
```

### Solo admin ve todos los pagos, padres solo los suyos

```sql
create policy "Payment visibility"
  on payments for select
  using (
    parent_id = auth.uid()
    or exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
```

---

## 🔔 Realtime (Supabase)

Habilitar realtime en estas tablas para actualizaciones en vivo:
- `chat_messages` — mensajes en tiempo real
- `message_reactions` — reacciones live
- `match_events` — partido en vivo
- `match_states` — marcador en vivo
- `notifications` — push badge

```sql
-- En Supabase Dashboard → Database → Replication
-- Activar las tablas mencionadas
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table message_reactions;
alter publication supabase_realtime add table match_events;
alter publication supabase_realtime add table match_states;
alter publication supabase_realtime add table notifications;
```

---

## 🌱 Datos semilla iniciales

```sql
-- Categorías del club (o hardcoded en el frontend)
-- Nota: son strings, no necesitan tabla

-- Admin inicial (crear a mano en Supabase Dashboard después del deploy):
-- 1. Registrar el admin en Auth
-- 2. INSERT INTO profiles con role='admin'
-- 3. Ese admin invita al resto por la app
```

---

## 🚀 Storage buckets

En Supabase Storage crear:

| Bucket | Público | Uso |
|---|---|---|
| `player-photos` | Sí | Fotos de perfil de jugadores |
| `parent-photos` | Sí | Fotos de perfil de tutores |
| `documents` | No (privado) | INE, actas, fichas médicas |
| `payment-receipts` | No (privado) | Comprobantes de pago |
| `match-highlights` | Sí | Fotos/videos de partidos |
| `chat-attachments` | No (privado) | Archivos en chat |

---

## 📦 Edge Functions (opcional)

Para lógica del servidor:

- `send-notification` — dispara push via OneSignal
- `stripe-webhook` — procesa pagos completados
- `daily-attendance-summary` — cron diario para admin
- `payment-reminder` — cron mensual 3 días antes de vencer

---

**Este esquema cubre 100% de la funcionalidad del prototipo actual.**

Genspark Code puede tomarlo directamente y montar Supabase automáticamente.
