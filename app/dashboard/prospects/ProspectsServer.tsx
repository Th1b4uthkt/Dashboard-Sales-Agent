import { createClient } from '@/utils/supabase/server'
import ProspectSearch from '@/components/prospects/ProspectSearch'

interface Tag {
  tag: {
    id: string;
    name: string;
  }
}

export default async function ProspectsServer() {
  const supabase = createClient()
  const { data: prospects, error } = await supabase
    .from('prospects')
    .select(`
      *,
      tags:prospect_tags(
        tag:tags(*)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching prospects:', error)
    return <div>Error loading prospects</div>
  }

  // Transformer les données pour correspondre à la structure attendue
  const formattedProspects = prospects.map(prospect => ({
    ...prospect,
    tags: prospect.tags.map((t: Tag) => t.tag)
  }))

  return <ProspectSearch initialProspects={formattedProspects} />
}
