
import { Ticket, EvaluationResult } from "../types";
import { TICKET_POOL, LocalTicket } from "../constants";

export const generateNewLocalTicket = (excludeIds: string[]): Ticket => {
  const available = TICKET_POOL.filter(t => !excludeIds.includes(t.id));
  const pool = available.length > 0 ? available : TICKET_POOL;
  const selected = pool[Math.floor(Math.random() * pool.length)];
  
  return {
    id: selected.id + '-' + Date.now(),
    sender: selected.sender,
    subject: selected.subject,
    body: selected.body,
    difficulty: selected.difficulty,
    timestamp: 'Just now',
    status: 'Open'
  };
};

export const evaluateLocalResponse = (ticket: Ticket, responseText: string): EvaluationResult => {
  const originalTicket = TICKET_POOL.find(t => t.sender === ticket.sender);
  const lowerResponse = responseText.toLowerCase();
  
  if (!originalTicket) {
    return {
      rating: 3,
      comment: "Generic response processed by the automated North Pole mail bot.",
      stressImpact: 2,
      satisfactionImpact: 5
    };
  }

  let matches = 0;
  originalTicket.keywords.forEach(kw => {
    if (lowerResponse.includes(kw.toLowerCase())) {
      matches++;
    }
  });

  // Basic scoring logic
  if (matches >= 2) {
    return {
      rating: 5,
      comment: `Excellent troubleshooting! ${originalTicket.successMessage}`,
      stressImpact: -5,
      satisfactionImpact: 20
    };
  } else if (matches === 1 || lowerResponse.length > 40) {
    return {
      rating: 4,
      comment: "Good effort. The user is reasonably satisfied with your technical advice.",
      stressImpact: 0,
      satisfactionImpact: 10
    };
  } else if (lowerResponse.includes("chimney") || lowerResponse.includes("cookies")) {
    return {
      rating: 3,
      comment: "Classic Santa! It didn't solve the tech issue, but the charm offensive worked.",
      stressImpact: 2,
      satisfactionImpact: 5
    };
  } else {
    return {
      rating: 1,
      comment: "The user has no idea what you're talking about. Stress levels rising!",
      stressImpact: 10,
      satisfactionImpact: -10
    };
  }
};
