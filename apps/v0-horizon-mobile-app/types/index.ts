export interface Interaction {
  id: string
  clientId?: string
  type: "call" | "email" | "meeting"
  date: string
  notes?: string
}

export interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address?: string
  priority: "high" | "medium" | "low"
  starred: boolean
  dealValue: number | null
  clientSince: string
  lastInteraction: {
    type: string
    date: string
  }
  interactions?: Interaction[]
  avatar?: string
}

