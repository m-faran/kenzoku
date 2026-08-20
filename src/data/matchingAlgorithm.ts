import type { Person } from "./mockData";

/**
 * Tokenize a comma-separated specificInterests string into normalized lowercase tokens.
 */
function tokenize(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Score and rank people by compatibility with the logged-in user.
 *
 * Scoring:
 *   - Each shared general interest: 1 point
 *   - Each shared specific interest (exact token match): 2 points
 *     (specific interests signal deeper alignment, so they're weighted higher)
 *
 * Returns a new array sorted by score descending. People with 0 overlap
 * are still included at the end — they're the "stretch" discoveries.
 */
export function rankPeopleByCompatibility(
  people: Person[],
  myInterests: string[],
  mySpecificInterests?: string
): Person[] {
  const myTokens = tokenize(mySpecificInterests);

  const scored = people.map((person) => {
    // General interest overlap (1 pt each)
    const generalScore = person.interests.filter((i) =>
      myInterests.includes(i)
    ).length;

    // Specific interest overlap (2 pts each)
    const personTokens = tokenize(person.specificInterests);
    const specificScore =
      myTokens.length > 0 && personTokens.length > 0
        ? personTokens.filter((t) => myTokens.includes(t)).length * 2
        : 0;

    return { person, score: generalScore + specificScore };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.person);
}
