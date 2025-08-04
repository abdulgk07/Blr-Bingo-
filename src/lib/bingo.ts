// Predefined list of 150 bingo entries
export const BINGO_ENTRIES: string[] = [
    "Friend reaches Dubai before you reach the airport.", "Google Maps asks to order you dinner.", "That's not a pothole, it's an infinity pool.", "Security deposit is higher than a small country's GDP.", "Auto driver agrees to go on the first try.", "Auto driver offers you exact change.", "Auto quotes less than double in the rain.", "Startup promises chai delivery by drone.", "AI translates your English into perfect Kannada.", "Politician promises a \"Namma AI\" to fix everything.", "\"Premium\" electric scooter is being pushed by hand.", "Apartment advertised with \"AI-optimized sunlight.\"", "More Ola scooters than working street lights.", "Instagram post with the caption \"#BangaloreWeather\".", "Cafe has more laptops than people.", "10-year-old discusses their \"exit strategy.\"", "Someone complains about traffic *while in traffic*.", "Avocados are now sold in jewellery shops.", "\"Prompt Engineering\" on a marriage biodata.", "A company adds \".ai\" to its name.", "‘Personalized Recommendations’. Really?", "UPI payment is stuck on 'processing'.", "Aunty asks you to 'fix the Wallpaper' on her phone.", "Pre-wedding photoshoot has an \"AI theme.\"", "Wedding drone focuses more on food than the couple.", "Keyboard AI auto-suggests Hinglish.", "Someone tries to pay with cryptocurrency.", "Security guard is replaced by a tablet.", "Tinder matches you with an AI bot.", "You get an ad for something you just dreamt about.", "AI health app suggests \"try relaxing\" after coffee.", "Late food delivery gets you a 10% off coupon.", "Relative forwards obvious AI-written fake news.", "Mom tries to bargain with a chatbot.", "Mom asks Alexa if it has eaten lunch.", "Mom asks Google for marriage proposals for you.", "She shouts at the washing machine for a *haldi* stain.", "Mom thinks the AI voice is a real person.", "AI recipe for \"healthy\" food still has lots of ghee.", "Mom shows the smart speaker a photo.", "Mom forwards \"AI radiation\" WhatsApp message.", "AI plays heavy metal instead of a *bhajan*.", "Boss uses ChatGPT for a farewell email.", "Email contains `[Insert Name Here]`.", "Performance review includes \"AI tools used.\"", "\"Brainstorming\" is just quiet ChatGPT use.", "Meeting about using AI to reduce meetings.", "Boss uses \"synergy\" and \"AI\" in one sentence.", "You're asked to \"train the AI\" (do data entry).", "\"Fun Friday\" activity is an AI-generated quiz.", "Boss \"circles back\" on a great AI idea.", "Colleague lists \"AI communication\" as a skill.", "Company's \"AI chatbot\" is just the FAQ page.", "AI plot is better than a new Bollywood movie.", "Deepfake actor sells pan masala.", "AI-generated song sounds like a 90s copy.", "Director claims AI was a co-writer.", "Karan Johar says AI can't replace a star kid.", "\"I don't watch Bollywood\" as a personality trait.", "A remake nobody asked for is announced.", "AI-generated poster has six-fingered actors.", "Reality show judge cries for no reason.", "Celebrity couple gets a hashtag name.", "Character goes to Switzerland just to dance.", "M.F. Husain's AI creates a masterpiece.", "Food delivery app shows a boat icon.", "Weather app shows clouds for the next two months.", "Weather app predicts \"light drizzle\" during a cyclone.", "\"Waterproof\" phone dies in a Bengaluru downpour.", "Google Maps adds a \"Swim To\" option.", "Wi-Fi signal drops when it starts raining.", "Someone posts a \"chai and pakora\" story.", "Flooded flyover looks like a stairway to Lord Indra.", "\"I fear AI will take my job.\"", "Stock photo of a blue robot brain.", "\"It's just a fancy `if` statement.\"", "Using \"AI\" to describe a spreadsheet.", "News article about AI shows the Terminator.", "\"The algorithm\" is blamed for everything.", "Chatbot says \"As a large language model...\"", "Someone asks an AI image generator to make \"art.\"", "Chatbot gives a completely \"hallucinated\" answer.", "\"This will revolutionize the industry.\"", "AI generates a \"Top 10\" list of obvious things.", "Company claims its AI has \"empathy.\"", "Someone is worried their speaker is \"always listening.\"", "A \"Smart\" device just connects to Wi-Fi."
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
