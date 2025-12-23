
export interface Ticket {
  id: string;
  sender: string;
  subject: string;
  body: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timestamp: string;
  status: 'Open' | 'Resolved' | 'Escalated';
}

export interface GameState {
  score: number;
  ticketsResolved: number;
  satisfaction: number; // 0-100
  stressLevel: number; // 0-100
  inventory: string[];
}

export interface EvaluationResult {
  rating: number; // 1-5
  comment: string;
  stressImpact: number;
  satisfactionImpact: number;
}
