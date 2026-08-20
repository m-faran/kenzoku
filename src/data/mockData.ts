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

export type Notification = {
  id: string;
  type: "connection" | "message" | "discovery" | "shared";
  text: string;
  timestamp: string;
  read: boolean;
  avatarUrl?: string;
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


export const PEOPLE: Person[] = [
  {
    id: "1",
    name: "Ali",
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
    id: "2",
    name: "Sarah",
    age: 25,
    city: "New York",
    bio: "Street photographer chasing light. Film camera enthusiast.",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&auto=format",
    specificInterests: "Street Photography, Film cameras, Jazz, Indie cinema",
    interests: ["photography", "film", "music", "books", "art"],
  },
  {
    id: "3",
    name: "Marcus",
    age: 28,
    city: "Berlin",
    bio: "Full-stack dev by day, Rust evangelist by night. Obsessed with systems programming.",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&auto=format",
    specificInterests: "Solidity, Fullstack",
    interests: ["coding", "technology", "robotics", "chess"],
  },
  {
    id: "4",
    name: "Yemi",
    age: 24,
    city: "Lagos",
    bio: "Building the next big thing from Lagos. Startup founder, music producer on weekends.",
    photo:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=600&h=800&fit=crop&auto=format",
    motive: "Networking and finding co-founders",
    specificInterests: "Music production, React Native",
    interests: [
      "startups",
      "music",
      "technology",
      "coding",
      "fitness",
    ],
  },
  {
    id: "5",
    name: "Lena",
    age: 26,
    city: "Tokyo",
    bio: "Astrophotographer trying to capture the Milky Way from my rooftop. Anime lover.",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&auto=format",
    specificInterests: "Astrophotography, capturing the Milky Way",
    interests: ["science", "anime", "photography", "film", "books"],
  },
  {
    id: "6",
    name: "Dav",
    age: 23,
    city: "Paris",
    bio: "Robotics engineer. Also into chess and 3D printing weird things.",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&auto=format",
    specificInterests: "3D printing weird things",
    interests: ["robotics", "chess", "technology", "coding", "gaming"],
  },
  {
    id: "7",
    name: "Priya",
    age: 27,
    city: "Mumbai",
    bio: "Filmmaker working on my first feature. Love finding hidden gems in cinema.",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&auto=format",
    specificInterests: "Indie cinema, Screenwriting, Music production",
    interests: ["film", "startups", "books", "art", "music"],
  },
  {
    id: "8",
    name: "Jonas",
    age: 29,
    city: "Stockholm",
    bio: "Climber and yoga practitioner. Also deep into fitness science.",
    photo:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&h=800&fit=crop&auto=format",
    specificInterests: "Fitness science",
    interests: ["climbing", "yoga", "fitness", "outdoors", "photography"],
  },
];

export const CHAT_THREADS: ChatThread[] = [
  {
    personId: "1",
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
    personId: "2",
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
  {
    personId: "4",
    lastMessage: "We should catch up — I'm also deep in the startup grind",
    lastMessageTime: "Mon",
    unread: 1,
    messages: [
      {
        id: "m1",
        text: "Fellow founder? What are you building?",
        fromMe: false,
        timestamp: "Mon 11:00 AM",
      },
      {
        id: "m2",
        text: "A dev tool for distributed teams. Early stage still.",
        fromMe: true,
        timestamp: "Mon 11:30 AM",
      },
      {
        id: "m3",
        text: "We should catch up — I'm also deep in the startup grind",
        fromMe: false,
        timestamp: "Mon 12:00 PM",
      },
    ],
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "connection",
    text: "Ali connected with you",
    timestamp: "2h ago",
    read: false,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
  },
  {
    id: "n2",
    type: "message",
    text: "Sarah sent you a message",
    timestamp: "Yesterday",
    read: false,
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format",
  },
  {
    id: "n3",
    type: "shared",
    text: "Someone shares 4 of your interests",
    timestamp: "Yesterday",
    read: true,
  },
  {
    id: "n4",
    type: "discovery",
    text: "You have 3 new people to discover",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: "n5",
    type: "connection",
    text: "Yemi connected with you",
    timestamp: "3 days ago",
    read: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop&auto=format",
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
  return PEOPLE.find((p) => p.id === id);
}