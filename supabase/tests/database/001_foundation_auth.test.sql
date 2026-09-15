begin;
select plan(14);

select has_type('public', 'app_role', 'app_role enum exists');
select has_table('public', 'profiles', 'profiles table exists');
select col_is_pk('public', 'profiles', 'id', 'profiles.id is the primary key');
select col_type_is('public', 'profiles', 'role', 'app_role', 'role uses app_role');
select is(
  (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass),
  true,
  'profiles has RLS enabled'
);
select policies_are(
  'public',
  'profiles',
  array['profiles_select_own', 'profiles_update_own'],
  'profiles exposes only own-row policies'
);
select ok(
  case
    when to_regprocedure('public.rls_auto_enable()') is null then true
    else not has_function_privilege('anon', 'public.rls_auto_enable()', 'EXECUTE')
  end,
  'anon cannot execute rls_auto_enable'
);
select ok(
  case
    when to_regprocedure('public.rls_auto_enable()') is null then true
    else not has_function_privilege('authenticated', 'public.rls_auto_enable()', 'EXECUTE')
  end,
  'authenticated cannot execute rls_auto_enable'
);
select has_trigger(
  'public',
  'profiles',
  'profiles_set_updated_at',
  'profile timestamp trigger exists'
);
select has_trigger(
  'auth',
  'users',
  'auth_user_created_profile',
  'auth profile trigger exists'
);
select ok(
  has_table_privilege('authenticated', 'public.profiles', 'SELECT'),
  'authenticated can select profiles through RLS'
);
select ok(
  has_column_privilege('authenticated', 'public.profiles', 'display_name', 'UPDATE')
  and has_column_privilege('authenticated', 'public.profiles', 'mobile_number', 'UPDATE'),
  'authenticated can update editable profile columns'
);
select ok(
  not has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE'),
  'authenticated cannot update profile roles'
);
select ok(
  not has_table_privilege('authenticated', 'public.profiles', 'INSERT')
  and not has_table_privilege('authenticated', 'public.profiles', 'DELETE'),
  'authenticated cannot insert or delete profiles'
);

select * from finish();
rollback;
