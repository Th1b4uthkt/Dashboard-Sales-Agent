import { createClient } from '@/utils/supabase/server'
import ProspectSearch from '@/components/prospects/ProspectSearch'

export default async function ProspectsServer() {
  const supabase = createClient()
  const { data: prospects, error } = await supabase
    .from('prospects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching prospects:', error)
    return <div>Error loading prospects</div>
  }

  return <ProspectSearch initialProspects={prospects} />
}