import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  const client = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: caller } = await client.from('profiles').select('role,is_active').eq('id', (await client.auth.getUser()).data.user?.id).single();

  if (caller?.role !== 'ADMIN' || !caller?.is_active) {
    return new Response('Forbidden', { status: 403 });
  }

  const { email, full_name, role, default_warehouse_id } = await req.json();

  const { data: created, error } = await client.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (error || !created.user) {
    return new Response(error?.message ?? 'Cannot create user', { status: 400 });
  }

  const { error: profileError } = await client.from('profiles').upsert({
    id: created.user.id,
    full_name,
    role,
    is_active: true,
    default_warehouse_id,
  });

  if (profileError) return new Response(profileError.message, { status: 400 });
  return Response.json({ id: created.user.id });
});
