# Christlete

**A faith-centered platform for Christian athletes.**

Daily devotionals built around sports life. Pregame prayer check-ins. Verified team and event prayer groups. Built for the real moments of competition.

---

## The Idea

Athletes face some of the most spiritually significant moments of their lives inside competition — before big games, after hard losses, during injuries, on the team bus. There isn't a product built to meet them there.

Christlete closes that gap.

---

## What's in This Repo

```
christlete/
├── app/              Expo React Native app (iOS + Android)
├── web/              Next.js web app (full functionality + auth)
└── supabase/         Database schema and seed data
```

---

## Core Features (V1)

| Feature | App | Web |
|---|---|---|
| Daily athlete-specific devotionals | ✓ | ✓ |
| Pregame prayer check-in flow | ✓ | ✓ |
| Team / event prayer groups | ✓ | ✓ |
| User onboarding (sport + struggle selection) | ✓ | ✓ |
| Auth (email + password via Supabase) | ✓ | ✓ |
| Profile + streak tracking | ✓ | ✓ |

---

## Getting Started

### Prerequisites

- Node.js 20+
- [Supabase](https://supabase.com) project (free tier works)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) for the mobile app
- [EAS CLI](https://docs.expo.dev/eas/) for App Store builds

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Open the SQL editor and run `supabase/schema.sql`
3. Copy your project URL and anon key from **Settings → API**

### 2. iOS App (`/app`)

```bash
cd app
npm install

# Create your env file
cp .env.example .env
# Fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY

# Start the dev server
npm run ios
```

**App Store build:**
```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas submit --platform ios
```

### 3. Web App (`/web`)

```bash
cd web
npm install

cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

npm run dev
# → http://localhost:3000
```

**Deploy to Vercel:**
```bash
vercel --prod
# Set env vars in Vercel dashboard or via vercel env add
```

---

## Environment Variables

### `/app/.env`
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### `/web/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Tech Stack

### Mobile (`/app`)
- **Expo** SDK 51 (React Native)
- **NativeWind** v4 (Tailwind for React Native)
- **Expo Router** v3
- **Supabase JS** v2
- **React Navigation** (Bottom Tabs + Native Stack)

### Web (`/web`)
- **Next.js** 14 App Router
- **Tailwind CSS** v3
- **Supabase SSR** (`@supabase/ssr`)
- **Lucide React** for icons
- Deployed on **Vercel**

### Backend
- **Supabase** (Postgres + Auth + Row Level Security)
- No custom API — all queries go through Supabase client

---

## App Structure

### iOS Screens
- **Onboarding** — Welcome, account creation, sport selection, struggle selection
- **Home** — Daily verse, today's devotional card, quick actions
- **Devotional** — Full devotional with scripture, body, reflection prompt, journaling
- **Pregame Prayer** — Multi-step check-in: feeling picker → what you're carrying → personalized prayer
- **Groups** — Team and event prayer groups with join/create/invite code
- **Profile** — Stats, streak tracker, what you're carrying, account settings

### Web Pages
- `/` — Landing page (marketing)
- `/login` — Email/password sign in
- `/signup` — Two-step registration (account → sport selection)
- `/dashboard` — Home with today's devotional and quick actions
- `/devotional` — Full devotional + journal
- `/prayer` — Pregame prayer check-in flow
- `/groups` — Prayer groups browser and management
- `/profile` — Profile, stats, and account settings

---

## Design Language

- **Background**: `#0F172A` (deep navy)
- **Accent**: `#F59E0B` (amber/gold)
- **Text**: white + slate scale
- **Cards**: `#1e2d47` with `#1e3a6e` borders
- **Border highlights**: `#F59E0B` at 20–30% opacity

Peaceful. Clear. Faith-first. Not a social feed.

---

## Roadmap

**V2**
- AI journaling and personalized prayer prompts
- Bus devotional sharing
- Outreach and invite tools
- Team leader controls

**V3**
- Coach features
- Tournament event matchmaking
- Testimony sharing
- Deeper personalization engine

---

## Contributing

Pull requests welcome. If you're building on Christlete, keep the mission in focus:

> Faith before clout. Peace before noise. Community before content overload.

---

*Built with purpose.*
