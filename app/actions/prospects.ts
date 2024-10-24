'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { parse } from 'csv-parse/sync'

const ProspectSchema = z.object({
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  country_code: z.string().min(2, "Country code is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).default('New'),
  provider: z.string().optional(),
})

export async function addProspect(formData: FormData) {
  const supabase = createClient()

  const prospectData = {
    email: formData.get('email') as string,
    first_name: formData.get('firstName') as string,
    last_name: formData.get('lastName') as string,
    country_code: formData.get('countryCode') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    status: formData.get('status') as string,
    provider: formData.get('provider') as string,
  }

  try {
    const prospect = ProspectSchema.parse(prospectData)
    const { data, error } = await supabase.from('prospects').insert(prospect).select()

    if (error) {
      console.error('Error adding prospect:', error)
      return { success: false, error: error.message }
    }

    const tags = formData.getAll('tags') as string[]
    if (tags.length > 0) {
      const prospectId = data[0].id
      for (const tagName of tags) {
        await addOrCreateTagForProspect(prospectId, tagName)
      }
    }

    revalidatePath('/dashboard/prospects')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
      return { success: false, error: error.errors }
    }
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

async function addOrCreateTagForProspect(prospectId: number, tagName: string) {
  const supabase = createClient()

  // Vérifier si le tag existe déjà
  const { data: existingTag, error: fetchError } = await supabase
    .from('tags')
    .select('id')
    .eq('name', tagName)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching tag:', fetchError)
    return
  }

  let tagId: string

  if (!existingTag) {
    // Créer le tag s'il n'existe pas
    const { data: newTag, error: createTagError } = await supabase
      .from('tags')
      .insert({ name: tagName })
      .select()
      .single()

    if (createTagError) {
      console.error('Error creating tag:', createTagError)
      return
    }

    tagId = newTag.id
  } else {
    tagId = existingTag.id
  }

  // Ajouter l'association prospect-tag
  const { error: linkError } = await supabase
    .from('prospect_tags')
    .insert({ prospect_id: prospectId, tag_id: tagId })

  if (linkError) {
    console.error('Error linking tag to prospect:', linkError)
  }
}

export async function importProspects(formData: FormData) {
  console.log('importProspects called')
  const file = formData.get('file') as File
  if (!file) {
    console.log('No file provided')
    return { success: false, error: 'No file provided' }
  }
  console.log('File received:', file.name)

  const content = await file.text()
  console.log('File content:', content.substring(0, 100) + '...')
  const records = parse(content, { 
    columns: ['email', 'first_name', 'last_name', 'country_code', 'phone', 'address', 'status', 'provider'],
    skip_empty_lines: true,
    from_line: 2 // Skip the header row
  })
  console.log('Parsed records:', records.length)

  const validatedRecords = []
  const errors = []
  const skippedEmails = []

  for (const [index, record] of records.entries()) {
    try {
      const validatedRecord = ProspectSchema.parse(record)
      validatedRecords.push(validatedRecord)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = `Row ${index + 2}: ${error.errors.map(e => `${e.path}: ${e.message}`).join(', ')}`
        console.error(errorMessage)
        errors.push(errorMessage)
      }
    }
  }

  if (errors.length > 0) {
    console.log('Validation errors:', errors)
    return { success: false, error: `Validation errors:\n${errors.join('\n')}` }
  }

  console.log('Validated records:', validatedRecords.length)

  const supabase = createClient()
  
  for (const record of validatedRecords) {
    const { error } = await supabase
      .from('prospects')
      .upsert(record, { 
        onConflict: 'email',
        ignoreDuplicates: false
      })

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        skippedEmails.push(record.email)
      } else {
        console.error('Error importing prospect:', error)
        return { success: false, error: error.message }
      }
    }
  }

  console.log('Import successful')
  revalidatePath('/dashboard/prospects')
  
  if (skippedEmails.length > 0) {
    return { 
      success: true, 
      message: `Import completed. ${skippedEmails.length} duplicate email(s) were updated.`
    }
  }
  
  return { success: true, message: 'All records imported successfully.' }
}
