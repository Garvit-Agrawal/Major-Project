
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hrnolytccyzwzgpuehqx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhybm9seXRjY3l6d3pncHVlaHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMDM5OTIsImV4cCI6MjA1Nzg3OTk5Mn0.vkJxMgZqi8-oQzJWefpZbsAK6eFH_rZwkl0YPxUUpVg'
export const supabase = createClient(supabaseUrl, supabaseKey)