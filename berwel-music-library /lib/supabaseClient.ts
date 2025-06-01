import { createBrowserClient } from '@supabase/ssr';
// We won't use createRouteHandlerClient here as this is for the client side

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure environment variables are defined
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
}

// Create a single supabase client for interacting with your database from the browser
const supabase = createBrowserClient(
  supabaseUrl,
  supabaseKey
);

export default supabase; 