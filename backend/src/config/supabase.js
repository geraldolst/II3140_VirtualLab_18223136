// Load environment variables FIRST
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.error('SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
    console.error('SUPABASE_ANON_KEY:', supabaseKey ? 'SET' : 'MISSING');
    throw new Error('Missing Supabase environment variables!');
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log(' Supabase client initialized');

module.exports = supabase;
