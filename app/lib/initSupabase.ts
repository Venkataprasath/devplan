import { createClient } from '@supabase/supabase-js'

export const supabase = createClient("https://gwhrsedtrnmwxcklefwi.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aHJzZWR0cm5td3hja2xlZndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIzNzk5OTksImV4cCI6MjAyNzk1NTk5OX0.E63zKlgy5Wwfqv1_9PZQ2eoACe9vF3yMByHc6qv_l-8");