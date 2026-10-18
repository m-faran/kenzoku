# Kenzoku (眷属) — Find Your People

## Introduction

Finding genuine friends who share your niche interests shouldn't feel like a chore or an awkward guessing game. **Kenzoku** (from the Japanese word meaning _family_, _kin_, or _kindred spirits_) is a mobile community app designed to help you connect with people who are on your exact wavelength.

Whether you are into chess, film photography, indie game development, rock climbing, or robotics, Kenzoku helps you build your true inner circle based on authentic passions, not superficial metrics.

---

## Description

Kenzoku strips away the noise and superficiality of traditional social networks, putting shared interests and real connections front and center:

- **Passions-First Profiles**: Beyond just a name and photo, your profile highlights what you actually care about—your favorite hobbies, specific niches, personal motivations, and what you're looking for in a community.
- **Shared Interest Discovery**: Discover nearby people who share your exact interests. The app highlights what you have in common upfront (e.g., _"You both like Photography & Film"_).
- **Mutual Connection Requests**: No unsolicited spam. A chat channel only opens when two people mutually agree to connect.
- **Real-Time Direct Messaging**: Seamlessly chat with your new connections in clean, instantaneous 1-on-1 conversations.
- **Privacy & Community Safety**: You stay in complete control of your visibility. Block or report bad actors instantly with built-in safety features.

---

## Technical Architecture

Kenzoku is built as a cross-platform mobile application powered by a reactive TypeScript stack, real-time PostgreSQL database, and token-based design system.

### Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                   React Native / Expo                  │
│       (Expo SDK 57, React 19, TypeScript, NativeWind)   │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
        State & Queries              Direct Calls
               │                          │
┌──────────────▼─────────────┐     ┌──────▼──────────────┐
│    TanStack React Query    │     │ React Context       │
│  (Cache, Optimistic UI)    │     │ (Auth & User State) │
└──────────────┬─────────────┘     └──────┬──────────────┘
               │                          │
               └───────────┬──────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                   Supabase Backend                     │
│  ┌───────────────────────┬──────────────────────────┐  │
│  │ Supabase Auth (JWT)   │ Storage (Avatars Bucket) │  │
│  ├───────────────────────┼──────────────────────────┤  │
│  │ PostgreSQL with RLS   │ Realtime (WebSockets)    │  │
│  └───────────────────────┴──────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Client Runtime**: [React Native 0.86.2](https://reactnative.dev/) with [Expo SDK 57](https://expo.dev/) and React 19.
- **Language**: TypeScript (~6.0) with strict typing across navigation params, API contracts, and component props.
- **Styling & UI**:
  - [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS v3 preset) for utility-first styling.
  - Custom typography with `@expo-google-fonts/nunito` (display) and `@expo-google-fonts/poppins` (body).
  - `@expo/vector-icons` (Ionicons) and `expo-linear-gradient` for micro-interactions and visual accents.
- **Navigation**:
  - `@react-navigation/native` & `@react-navigation/native-stack` for authentication, profile setup, and modal screens.
  - `@react-navigation/bottom-tabs` for the persistent 4-tab shell (`Discover`, `Chats`, `Notifications`, `Profile`).
- **Data Fetching & Cache**:
  - `@tanstack/react-query` (v5) managing query caching, stale-while-revalidate cycles, deduplication, and optimistic message updates.
- **Backend & Database**:
  - [Supabase](https://supabase.com/) (`@supabase/supabase-js`) providing:
    - **PostgreSQL 15+**: Relational data model for `profiles`, `connections`, `chat_channels`, `messages`, `notifications`, `blocks`, and `reports`.
    - **Row Level Security (RLS)**: Enforces data isolation and permission boundaries directly in the database engine.
    - **Supabase Realtime**: WebSocket broadcast and presence over PostgreSQL logical replication for instant direct messaging.
    - **Supabase Storage**: Bucket-backed storage for user avatar uploads with client-side compression via `expo-image-manipulator`.
- **Matching & Ranking Engine**:
  - Deterministic client-side scoring algorithm (`rankPeopleByCompatibility` in `src/data/matchingAlgorithm.ts`).
  - Evaluates overlap: +1 point per shared general interest, +2 points per normalized specific interest token match. Excludes existing connections and blocked users.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22.x recommended; matches `.nvmrc`)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your mobile device, or configured iOS Simulator / Android Emulator

### 1. Clone the Repository

```bash
git clone https://github.com/m-faran/inner-circle.git
cd kenzoku
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
3. Create a public storage bucket named `avatars`:
   - Set **Public Bucket** to `true`.
   - Recommended maximum upload size: 500 KB (`512000` bytes).
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`.
4. _(Optional)_ Seed test accounts by following the instructions inside [`supabase/seed.sql`](supabase/seed.sql).

### 4. Set Environment Variables

Create a `.env` file in the project root based on [`.env.example`](.env.example):

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run the Application

Start the Expo development server:

```bash
npm start
```

Use the terminal shortcuts to launch your target platform:

- Press `a` to run on Android emulator or connected device.
- Press `i` to run on iOS simulator.
- Press `w` to run in the web browser.
- Scan the printed QR code with **Expo Go** (Android) or the **Camera app** (iOS).

### Additional Scripts

- `npm run lint` — Runs ESLint and Prettier checks.
- `npm run format` — Automatically formats and fixes code issues.

---

## Directory Structure

```text
kenzoku/
├── .env.example               # Template for required environment variables
├── .nvmrc                     # Node.js runtime version pin (22.23.1)
├── App.tsx                    # Application entry point, font loaders, and providers
├── app.json                   # Expo configuration & app metadata
├── assets/                    # Static branding, splash screen, and icons
├── global.css                 # Tailwind / NativeWind global CSS entry
├── package.json               # Dependencies and npm scripts
├── tailwind.config.js         # Theme extensions, brand colors, and typography tokens
├── tsconfig.json              # TypeScript compiler configuration
├── supabase/
│   ├── schema.sql             # Database schema, triggers, and Row Level Security policies
│   └── seed.sql               # Development seed dataset and sample users
└── src/
    ├── components/            # Reusable UI primitives
    │   ├── Avatar.tsx         # User avatar component with fallback states
    │   ├── Button.tsx         # Primary and secondary styled buttons
    │   ├── ChatRow.tsx        # Conversation preview list row
    │   ├── Input.tsx          # Form text inputs with labels and error states
    │   ├── InterestChip.tsx   # Interactive badges for interests with emoji support
    │   ├── NotificationItem.tsx # Notification list element
    │   ├── PendingConnectionItem.tsx # Connection request approval card
    │   ├── PersonCard.tsx     # Discovery swipe/action card
    │   └── SettingsRow.tsx    # Settings list row with toggle or navigation options
    ├── context/               # Global React context providers
    │   ├── AuthContext.tsx    # Supabase session and authentication state
    │   ├── NotificationContext.tsx # Notification state container
    │   ├── QueryProvider.tsx  # TanStack Query client configuration
    │   └── UserContext.tsx    # Current user profile cache and persistence
    ├── data/                  # Static definitions and business logic
    │   ├── matchingAlgorithm.ts # Compatibility scoring & interest tokenization
    │   └── mockData.ts        # Default interests taxonomy and helper functions
    ├── hooks/                 # Custom React Query and Realtime hooks
    │   ├── useBlocks.ts       # Block and unblock mutations & queries
    │   ├── useChat.ts         # Channels, message queries, and realtime subscriptions
    │   ├── useConnections.ts  # Connection requests, approvals, and queries
    │   ├── useDiscoverProfiles.ts # Recommendation query hook
    │   └── useNotifications.ts# Notifications list query hook
    ├── lib/                   # Third-party wrappers and Supabase API services
    │   ├── api/
    │   │   ├── auth.ts        # Auth helpers (sign up, sign in, sign out)
    │   │   ├── blocks.ts      # User blocklist database operations
    │   │   ├── chat.ts        # Channels, messaging API, and realtime listeners
    │   │   ├── connections.ts # Connection lifecycle operations
    │   │   ├── notifications.ts # Fetch and mark notifications as read
    │   │   ├── profiles.ts    # Profile fetch, upsert, and discovery filtering
    │   │   └── storage.ts     # Image picker, compression, and avatar upload
    │   └── supabase.ts        # Supabase client instantiation with AsyncStorage
    ├── navigation/            # Navigation structure and stack definitions
    │   ├── MainTabs.tsx       # Bottom tab navigator (Discover, Chats, Notifications, Profile)
    │   ├── RootNavigator.tsx  # Root stack (Auth flow vs. Main app flow)
    │   └── stacks/
    │       ├── ChatsStack.tsx # Conversation list and 1:1 chat view
    │       ├── DiscoverStack.tsx # Discover card deck and full profile view
    │       └── ProfileStack.tsx  # Profile view, editor, settings, and privacy
    └── screens/               # Application screen components
        ├── ChatScreen.tsx     # Live 1-on-1 messaging screen
        ├── ChatsScreen.tsx    # Active conversations list screen
        ├── DiscoverScreen.tsx # Interest-based match discovery deck
        ├── EditProfileScreen.tsx # Profile information and photo editor
        ├── InterestSelectionScreen.tsx # Interest selection and custom tag addition
        ├── LoginScreen.tsx    # Email and password authentication screen
        ├── NotificationsScreen.tsx # Activity and pending connection requests
        ├── PersonProfileScreen.tsx # Detailed view of another user's profile
        ├── PrivacySafetyScreen.tsx # Discovery visibility and account controls
        ├── ProfileScreen.tsx  # Current user's profile overview
        ├── ProfileSetupScreen.tsx # Onboarding step for personal info & bio
        ├── SettingsScreen.tsx # App preferences, notifications, and sign-out
        ├── SignUpScreen.tsx   # Account registration screen
        └── WelcomeScreen.tsx  # Splash and introductory landing screen
```

---

**Warning:** All rights reserved. This code may not be copied, modified, or distributed without explicit permission.
