export type Interest = {
  id: string;
  label: string;
  emoji: string;
};

export type Person = {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  photo: string;
  motive?: string;
  specificInterests?: string;
  interests: string[];
};

export const ALL_INTERESTS: Interest[] = [
  { id: "chess", label: "Chess", emoji: "♟️" },
  { id: "photography", label: "Photography", emoji: "📷" },
  { id: "coding", label: "Coding", emoji: "💻" },
  { id: "technology", label: "Technology", emoji: "📱" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "books", label: "Books", emoji: "📚" },
  { id: "fitness", label: "Fitness", emoji: "🏋️" },
  { id: "anime", label: "Anime", emoji: "🎌" },
  { id: "film", label: "Film", emoji: "🎬" },
  { id: "drawing", label: "Drawing", emoji: "✏️" },
  { id: "robotics", label: "Robotics", emoji: "🤖" },
  { id: "startups", label: "Startups", emoji: "🚀" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "outdoors", label: "Outdoors", emoji: "🌲" },
  { id: "art", label: "Art", emoji: "🎨" },
  { id: "climbing", label: "Climbing", emoji: "🧗" },
  { id: "yoga", label: "Yoga", emoji: "🧘" },
];

export function getSharedInterests(personInterests: string[], myInterests: string[]): string[] {
  return personInterests.filter((i) => myInterests.includes(i));
}

export function getInterestLabel(id: string): string {
  return ALL_INTERESTS.find((i) => i.id === id)?.label ?? id;
}

export function getInterestEmoji(id: string): string {
  return ALL_INTERESTS.find((i) => i.id === id)?.emoji ?? "•";
}