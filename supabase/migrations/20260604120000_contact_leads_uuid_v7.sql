-- UUID v7 (ordenable por tiempo) para contact_leads

create or replace function public.uuid_generate_v7()
returns uuid
language plpgsql
volatile
as $$
declare
  v_unix_ms bigint;
  v_bytes bytea;
begin
  v_unix_ms := floor(extract(epoch from clock_timestamp()) * 1000)::bigint;
  v_bytes :=
    decode(lpad(to_hex(v_unix_ms), 12, '0'), 'hex')
    || gen_random_bytes(10);
  v_bytes := set_byte(v_bytes, 6, (get_byte(v_bytes, 6) & 15) | 112);
  v_bytes := set_byte(v_bytes, 8, (get_byte(v_bytes, 8) & 63) | 128);
  return encode(v_bytes, 'hex')::uuid;
end;
$$;

alter table public.contact_leads
  alter column id set default public.uuid_generate_v7();
