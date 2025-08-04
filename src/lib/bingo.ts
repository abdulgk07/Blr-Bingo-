// Predefined list of 150 bingo entries
export const BINGO_ENTRIES: string[] = [
  "Machine Learning", "Neural Network", "Deep Learning", "Generative AI", "Large Language Model (LLM)", 
  "Transformer", "Prompt Engineering", "RAG", "Vector Database", "Fine-Tuning",
  "React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui",
  "Server Component", "Client Component", "API Route", "Middleware", "Vercel",
  "Agile", "Scrum", "Sprint", "User Story", "Kanban",
  "CI/CD", "Git", "GitHub", "Docker", "Kubernetes",
  "Cloud Computing", "AWS", "Google Cloud", "Azure", "Serverless",
  "API", "REST", "GraphQL", "JSON", "YAML",
  "Authentication", "Authorization", "OAuth", "JWT", "Encryption",
  "Database", "SQL", "NoSQL", "PostgreSQL", "MongoDB",
  "Unit Testing", "Integration Testing", "E2E Testing", "Jest", "Cypress",
  "Design System", "UI/UX", "Accessibility (a11y)", "Figma", "Wireframe",
  "Pair Programming", "Code Review", "Refactoring", "Technical Debt", "DRY Principle",
  "SOLID", "Microservices", "Monolith", "Event-Driven", "Message Queue",
  "WebSockets", "HTTP/2", "Caching", "CDN", "Load Balancer",
  "DevOps", "Site Reliability", "Observability", "Logging", "Monitoring",
  "Python", "JavaScript", "Java", "Go", "Rust",
  "Data Structure", "Algorithm", "Big O Notation", "Time Complexity", "Space Complexity",
  "Functional Programming", "Object-Oriented", "State Management", "Props", "Hooks",
  "Component Library", "Storybook", "Responsive Design", "Mobile-First", "Grid Layout",
  "Flexbox", "CSS Variables", "Sass", "Webpack", "Vite",
  "Node.js", "Express.js", "Deno", "Bun", "npm",
  "Artificial Intelligence", "Natural Language Processing", "Computer Vision", "Reinforcement Learning", "Supervised Learning",
  "Unsupervised Learning", "Clustering", "Regression", "Classification", "TensorFlow",
  "PyTorch", "Hugging Face", "OpenAI", "Gemini", "Claude",
  "Data Pipeline", "ETL", "Data Warehouse", "Data Lake", "Apache Spark",
  "Agile Retrospective", "Sprint Planning", "Daily Stand-up", "Product Backlog", "Sprint Review",
  "TDD", "BDD", "Code Coverage", "Static Analysis", "Linter",
  "Containerization", "Orchestration", "IaC", "Terraform", "Ansible",
  "Virtual Machine", "Edge Computing", "IoT", "Blockchain", "Web3"
];

// Function to shuffle an array and pick the first N items
export function generateBingoCard(entries: string[]): string[] {
  const shuffled = [...entries].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 25);
}

// Function to get the indices of the winning pattern from AI's description
export function getWinningPatternIndices(patternDescription: string): number[] {
  const lowerCaseDescription = patternDescription.toLowerCase();
  
  // Check for rows
  for (let i = 0; i < 5; i++) {
    if (lowerCaseDescription.includes(`row ${i + 1}`) || lowerCaseDescription.includes(`${i + 1}. row`)) {
      return Array.from({ length: 5 }, (_, k) => i * 5 + k);
    }
  }

  // Check for columns
  for (let i = 0; i < 5; i++) {
    if (lowerCaseDescription.includes(`column ${i + 1}`) || lowerCaseDescription.includes(`${i + 1}. column`)) {
      return Array.from({ length: 5 }, (_, k) => i + k * 5);
    }
  }

  // Check for diagonals
  if (lowerCaseDescription.includes("diagonal") && (lowerCaseDescription.includes("top-left") || lowerCaseDescription.includes("top left"))) {
    return [0, 6, 12, 18, 24];
  }
  if (lowerCaseDescription.includes("diagonal") && (lowerCaseDescription.includes("top-right") || lowerCaseDescription.includes("top right"))) {
    return [4, 8, 12, 16, 20];
  }

  // Fallback for less specific diagonal descriptions
  if(lowerCaseDescription.includes("diagonal")) {
     // This is a guess, but better than nothing. Most prompts for AI will likely specify.
     // We can't know which one without more info, but we can check the board state.
     // For now, we'll assume the AI is specific enough and return an empty array if not.
  }
  
  return [];
}
