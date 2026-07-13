create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  product_id text not null,
  paypal_order_id text unique not null,
  status text not null default 'COMPLETED',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS)
alter table public.purchases enable row level security;

-- Los usuarios (si inician sesión luego con ese correo) podrían ver sus propias compras
create policy "Users can view own purchases"
on public.purchases
for select
to authenticated
using (auth.jwt() ->> 'email' = email);

-- Insertar compras solo se permite mediante service role (webhook backend)
-- No se necesitan políticas públicas para INSERT si lo hace el backend de Vercel con la Service Key.
