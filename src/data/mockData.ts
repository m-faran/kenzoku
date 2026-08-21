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

export type ChatMessage = {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: string;
};

export type ChatThread = {
  personId: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: ChatMessage[];
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



export const CHAT_THREADS: ChatThread[] = [
  {
    personId: "mock1",
    lastMessage: "Hey, are you playing tonight?",
    lastMessageTime: "2h",
    unread: 2,
    messages: [
      {
        id: "m1",
        text: "Hey! Saw we both like chess — do you play online?",
        fromMe: true,
        timestamp: "Yesterday 7:30 PM",
      },
      {
        id: "m2",
        text: "Yes! Chess.com mostly. What's your rating?",
        fromMe: false,
        timestamp: "Yesterday 7:45 PM",
      },
      {
        id: "m3",
        text: "Around 1400. Still improving. You?",
        fromMe: true,
        timestamp: "Yesterday 8:00 PM",
      },
      {
        id: "m4",
        text: "1650 here. We should play sometime!",
        fromMe: false,
        timestamp: "Yesterday 8:05 PM",
      },
      {
        id: "m5",
        text: "Hey, are you playing tonight?",
        fromMe: false,
        timestamp: "Today 10:00 AM",
      },
    ],
  },
  {
    personId: "mock2",
    lastMessage: "That camera looks great!",
    lastMessageTime: "Yesterday",
    unread: 0,
    messages: [
      {
        id: "m1",
        text: "Love your shots! What camera do you use?",
        fromMe: true,
        timestamp: "Monday 3:00 PM",
      },
      {
        id: "m2",
        text: "That camera looks great!",
        fromMe: false,
        timestamp: "Monday 4:00 PM",
      },
    ],
  },
];

export const MOCK_CHAT_PEOPLE: Person[] = [
  {
    id: "mock1",
    name: "Ali (Mock Chat)",
    age: 22,
    city: "London",
    bio: "Building things and playing chess. Always looking for a good game.",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&auto=format",
    motive: "Meeting like-minded builders",
    specificInterests: "Rust, Blockchain, Distributed Systems",
    interests: ["chess", "coding", "technology", "gaming", "startups"],
  },
  {
    id: "mock2",
    name: "Sarah (Mock Chat)",
    age: 25,
    city: "New York",
    bio: "Street photographer chasing light. Film camera enthusiast.",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&auto=format",
    specificInterests: "Street Photography, Film cameras, Jazz, Indie cinema",
    interests: ["photography", "film", "music", "books", "art"],
  },
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

export function getPersonById(id: string): Person | undefined {
  return MOCK_CHAT_PEOPLE.find((p) => p.id === id);
}