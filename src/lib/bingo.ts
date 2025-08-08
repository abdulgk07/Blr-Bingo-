

// Predefined list of 125 bingo entries
export const BINGO_ENTRIES: string[] = [
    "Friend reaches Dubai before you reach the airport.",
    "That's not a pothole, it's a BBMP-approved infinity pool.",
    "Security deposit is higher than a small country's GDP.",
    "Auto driver refuses to go to Whitefield.",
    "Auto driver says, \"Cash only.\"",
    "Auto driver quotes double for \"light cloud cover.\"",
    "Startup promises chai delivery by drone.",
    "Someone complains about traffic while working from home.",
    "You try to find a garden in the Garden City.",
    "\"Premium\" electric scooter is being pushed by hand.",
    "Apartment advertised with \"AI-optimized sunlight.\"",
    "Apartment is advertised as \"5 kms from City Centre.\"",
    "More Ola scooters than working street lights.",
    "Instagram post captioned \"#BangaloreWeather\".",
    "Every cafe is just a WeWork with better coffee.",
    "14-year-old discusses their \"exit strategy.\"",
    "You leave a party drunk and reach home sober (thanks to traffic).",
    "A new flyover's deadline is extended... again.",
    "Your landlord increases the rent because the metro is \"coming soon.\"",
    "A politician inaugurates a newly tarred road just before an election.",
    "You see a \"Do Not Spit Here\" sign with a giant red stain below it.",
    "Your cab driver gives you a startup pitch.",
    "Someone asks for \"less spicy\" in an Andhra joint.",
    "You see a car with a \"L\" sticker driving up a one-way street.",
    "A startup's \"office\" is a table at a Third Wave Coffee.",
    "Everyone complains about the city but refuses to leave.",
    "A new restaurant is described as having \"great vibes.\"",
    "Someone asks for the Wi-Fi password before saying hello.",
    "A landlord's rental ad says \"No Bachelors. Family ony.\"",
    "\"Prompt Engineer\" on a marriage biodata.",
    "A company adds \".ai\" to its name.",
    "‘Personalized Recommendations’. Really?",
    "UPI payment is stuck on 'processing'.",
    "Security guard is replaced by a tablet.",
    "Tinder matches you with an AI bot.",
    "You get an ad for something you just dreamt about.",
    "Someone starts a debate: Filter Coffee vs. Cappuccino.",
    "Food delivery: ₹100 coupon on a ₹130 delivery fee.",
    "\"The algorithm\" is blamed for everything.",
    "E-commerce chatbot says, \"As a large language model...\"",
    "Your first attempt at an AI image generator.",
    "ChatGPT gives a confidently \"hallucinated\" answer.",
    "LinkedIn post: \"This will revolutionize the industry.\"",
    "Using AI to generate a \"Top 10\" list of obvious things.",
    "Someone is worried their speaker is \"always listening.\"",
    "Your neighbor asks \"But, what's the TAM?\" at a coffee shop.",
    "Someone uses the word \"disrupt\" unironically.",
    "You overhear a conversation about \"crypto gains.\"",
    "Avocados are now sold in jewellery shops.",
    "Aunty asks you to 'fix the wallpaper' on her phone.",
    "Pre-wedding photoshoot has an \"AI theme.\"",
    "Wedding drone shoots more food than the couple.",
    "Keyboard AI auto-suggests Hinglish.",
    "Someone tries to pay for street food with crypto.",
    "Relative forwards obvious AI-written fake news.",
    "Mom tries to bargain with a chatbot.",
    "Mom asks Alexa if it has eaten lunch.",
    "Mom asks Google for marriage proposals for you.",
    "She shouts at the washing machine for a haldi stain.",
    "Mom thinks the AI voice is a real person.",
    "AI recipe for \"healthy\" food still has lots of ghee.",
    "Mom shows the smart speaker a photo.",
    "Mom forwards a \"Phone radiation is dangerous\" WhatsApp message.",
    "AI adds heavy metal to a bhajan playlist.",
    "Someone pronounces \"croissant\" perfectly but \"upma\" incorrectly.",
    "Someone asks an AI to write their wedding vows.",
    "A gym bro wears an unnecessarily tight suit to a wedding.",
    "Boss uses ChatGPT for a farewell email.",
    "Email contains [Insert Name Here].",
    "Performance review includes \"AI tools used.\"",
    "\"Brainstorming\" is just discussing ChatGPT suggestions.",
    "A meeting is scheduled to reduce the number of meetings.",
    "Boss uses \"synergy\" and \"AI\" in the same sentence.",
    "You're asked to \"train the AI\" (which means doing data entry).",
    "\"Fun Friday\" activity is an AI-generated quiz.",
    "Boss \"circles back\" on an obvious idea.",
    "Colleague lists \"AI Communication\" as a skill on LinkedIn.",
    "Company's \"AI chatbot\" is just the FAQ page.",
    "Someone says \"Let's take this offline\" in a physical meeting.",
    "You get a meeting request with no agenda.",
    "Someone's LinkedIn post starts with \"Thrilled to announce...\"",
    "A founder gives a TEDx talk about \"hustle culture.\"",
    "You see a \"We're hiring\" ad for a \"Growth Hacker Ninja.\"",
    "Startup Founder. Not funding. Sipping a ₹500 coffee.",
    "Colleague says \"scenes\" to describe a situation.",
    "Someone uses the phrase \"value-add\" in a casual conversation.",
    "AI plot is better than a new Akshay Kumar movie.",
    "Deepfake actor sells pan masala.",
    "AI-generated song sounds like a 90s copy.",
    "Director claims AI was a co-writer.",
    "Karan Johar says AI can't replace a star kid.",
    "\"I don't watch Bollywood\" becomes a personality trait.",
    "A remake nobody asked for is announced.",
    "AI-generated poster has six-fingered actors.",
    "Reality show judge cries for no reason.",
    "Celebrity couple gets a hashtag name.",
    "Bollywood actors go to Switzerland just to dance.",
    "M.F. Husain's AI creates a masterpiece.",
    "An actor is praised for \"looking their age.\"",
    "A reel is just a person pointing at text on screen.",
    "Food delivery app shows a boat icon.",
    "Weather app predicts clouds for the next two months.",
    "Weather app predicts \"light drizzle\" during a cyclone.",
    "\"Waterproof\" phone dies in a Bengaluru downpour.",
    "Google Maps adds a \"Swim To\" option.",
    "Wi-Fi signal drops the moment it starts raining.",
    "Someone posts a \"chai and pakora\" story on Instagram.",
    "Flooded flyover looks like a stairway to Lord Indra.",
    "\"I fear AI will take my job.\"",
    "Stock photo of a blue robot brain.",
    "\"It's just a fancy if statement.\"",
    "Using \"AI\" to describe a spreadsheet.",
    "News article about AI shows the Terminator.",
    "AI translates your English into perfect Kannada.",
    "Politician promises a \"Namma AI\" to fix everything."
];


// Function to shuffle an array and pick the first N items
export function generateBingoCard(entries: string[]): string[] {
  const shuffled = [...entries].sort(() => 0.5 - Math.random());
  const card = shuffled.slice(0, 25);
  card[12] = 'FREE'; // Set the free space
  return card;
}

// Function to check for a winning pattern
export function checkWin(markedSquares: boolean[]): boolean {
  const lines = [
    // Rows
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    // Columns
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    // Diagonals
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  for (const line of lines) {
    if (line.every(index => markedSquares[index])) {
      return true;
    }
  }
  return false;
}
