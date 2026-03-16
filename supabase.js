// Import the Supabase library from a CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Your Supabase project details
const SUPABASE_URL = 'https://ezzadlrriwggaytsktnh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6emFkbHJyaXdnZ2F5dHNrdG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTIxMTQsImV4cCI6MjA4OTE2ODExNH0.KN5ciyxKAJsHEt04d3quClfzD1Mi_fkZt-jOz3QHbgk'

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)