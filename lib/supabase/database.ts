import { supabase } from './client'

// User operations
export const createUser = async (email: string, name: string, university?: string) => {
  const { data, error } = await supabase
    .from('users')
    .insert({ email, name, university })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getUser = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Idea operations
export const createIdea = async (userId: string, title: string, description: string, category?: string) => {
  const { data, error } = await supabase
    .from('ideas')
    .insert({ user_id: userId, title, description, category })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getIdeas = async (userId: string) => {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getIdea = async (id: string) => {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const updateIdea = async (id: string, updates: {
  title?: string
  description?: string
  category?: string
  status?: 'draft' | 'brainstorming' | 'completed'
}) => {
  const { data, error } = await supabase
    .from('ideas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Brainstorm session operations
export const createBrainstormSession = async (ideaId: string) => {
  const { data, error } = await supabase
    .from('brainstorm_sessions')
    .insert({ idea_id: ideaId, messages: [] })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getBrainstormSession = async (ideaId: string) => {
  const { data, error } = await supabase
    .from('brainstorm_sessions')
    .select('*')
    .eq('idea_id', ideaId)
    .single()

  if (error) throw error
  return data
}

export const updateBrainstormSession = async (id: string, messages: any[], outline?: string) => {
  const { data, error } = await supabase
    .from('brainstorm_sessions')
    .update({ messages, outline })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Slides operations
export const createSlide = async (ideaId: string, slideUrl: string, presentationId: string) => {
  const { data, error } = await supabase
    .from('slides')
    .insert({ idea_id: ideaId, slide_url: slideUrl, presentation_id: presentationId })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getSlides = async (ideaId: string) => {
  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .eq('idea_id', ideaId)

  if (error) throw error
  return data
}

// Document operations
export const createDocument = async (ideaId: string, pdfUrl: string, sha256Hash: string) => {
  const { data, error } = await supabase
    .from('documents')
    .insert({ idea_id: ideaId, pdf_url: pdfUrl, sha256_hash: sha256Hash })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getDocuments = async (ideaId: string) => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('idea_id', ideaId)

  if (error) throw error
  return data
}

// Expert request operations
export const createExpertRequest = async (
  ideaId: string,
  userId: string,
  expertType: 'tax_accountant' | 'lawyer' | 'patent_attorney',
  message: string
) => {
  const { data, error } = await supabase
    .from('expert_requests')
    .insert({ idea_id: ideaId, user_id: userId, expert_type: expertType, message })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getExpertRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from('expert_requests')
    .select('*, ideas(title)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const updateExpertRequestStatus = async (id: string, status: 'pending' | 'sent' | 'replied') => {
  const { data, error } = await supabase
    .from('expert_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
