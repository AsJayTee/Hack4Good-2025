import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://epmpdrpmmlynnkqfjcpk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwbXBkcnBtbWx5bm5rcWZqY3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NDQ5OTQsImV4cCI6MjA1MjUyMDk5NH0.IGk80nbnKrDvDV1k9kQV2F2wbiT_yYtNR4CoVyGUZsU'
export const supabase = createClient(supabaseUrl, supabaseKey)
//create admin role
const { user, error } = await supabase.auth.update({
    data: { roles: 'admin' }
  })
  
