import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Sempre retorna uma instância do cliente, mesmo que as variáveis de ambiente não estejam configuradas
// Isso evita que o site quebre quando um usuário faz logout
export const supabase = createClient(
  supabaseUrl || 'https://hvlycmbcvcftathcnzdr.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHljbWJjdmNmdGF0aGNuemRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDMzMTMsImV4cCI6MjA3NTc3OTMxM30.WWZ9_bVwsYXstii8zO1Yt-b1sOnRZeamfGtgeutMEfc'
);