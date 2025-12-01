// ローカルストレージでデータ管理（データベースなし版）

export interface Idea {
  id: string
  title: string
  description: string
  category?: string
  createdAt: string
}

export interface BrainstormSession {
  ideaId: string
  messages: Array<{ role: 'user' | 'assistant', content: string }>
  outline?: string
}

const IDEAS_KEY = 'student_idea_launcher_ideas'
const SESSIONS_KEY = 'student_idea_launcher_sessions'

// アイデア管理
export const saveIdea = (idea: Idea): void => {
  const ideas = getIdeas()
  const existingIndex = ideas.findIndex(i => i.id === idea.id)

  if (existingIndex >= 0) {
    ideas[existingIndex] = idea
  } else {
    ideas.push(idea)
  }

  localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas))
}

export const getIdeas = (): Idea[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(IDEAS_KEY)
  return data ? JSON.parse(data) : []
}

export const getIdea = (id: string): Idea | null => {
  const ideas = getIdeas()
  return ideas.find(i => i.id === id) || null
}

export const deleteIdea = (id: string): void => {
  const ideas = getIdeas().filter(i => i.id !== id)
  localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas))
}

// セッション管理
export const saveSession = (session: BrainstormSession): void => {
  const sessions = getSessions()
  const existingIndex = sessions.findIndex(s => s.ideaId === session.ideaId)

  if (existingIndex >= 0) {
    sessions[existingIndex] = session
  } else {
    sessions.push(session)
  }

  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export const getSession = (ideaId: string): BrainstormSession | null => {
  const sessions = getSessions()
  return sessions.find(s => s.ideaId === ideaId) || null
}

export const getSessions = (): BrainstormSession[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(SESSIONS_KEY)
  return data ? JSON.parse(data) : []
}

export const deleteSession = (ideaId: string): void => {
  const sessions = getSessions().filter(s => s.ideaId !== ideaId)
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

// ID生成
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
