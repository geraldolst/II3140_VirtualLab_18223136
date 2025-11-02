// Supabase client initializer without hardcoding secrets.
// Expects global configuration set by configs/environment.js
// Usage: import { getSupabaseClient } from '../lib/supabase/client.js'

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

let cached;

export function getSupabaseClient() {
	if (cached) return cached;
	const url = window.__SUPABASE_URL;
	const anonKey = window.__SUPABASE_ANON_KEY;
	if (!url || !anonKey) {
		console.warn('Supabase environment variables not set. Set window.__SUPABASE_URL and window.__SUPABASE_ANON_KEY in configs/environment.js');
		return null;
	}
	cached = createClient(url, anonKey);
	return cached;
}

