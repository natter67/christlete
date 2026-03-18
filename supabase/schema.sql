-- Christlete Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade not null unique,
  name          text not null,
  sport         text not null,
  school        text,
  grade         text,
  avatar_url    text,
  struggles     text[] default '{}',
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- DEVOTIONALS
-- ─────────────────────────────────────────
create table if not exists public.devotionals (
  id                uuid primary key default uuid_generate_v4(),
  title             text not null,
  scripture         text not null,
  scripture_ref     text not null,
  body              text not null,
  reflection_prompt text not null,
  sport_tags        text[] default '{}',
  day_index         int not null check (day_index between 0 and 6), -- 0=Sun ... 6=Sat
  published         boolean default true,
  created_at        timestamptz default now() not null
);

alter table public.devotionals enable row level security;

create policy "Anyone authenticated can read devotionals"
  on public.devotionals for select
  using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- PRAYER CHECKINS
-- ─────────────────────────────────────────
create table if not exists public.prayer_checkins (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  feeling     text not null,  -- 'anxious' | 'confident' | 'tired' | 'grateful' | 'overwhelmed' | 'focused'
  carrying    text,
  prayer_text text,
  created_at  timestamptz default now() not null
);

alter table public.prayer_checkins enable row level security;

create policy "Users manage their own checkins"
  on public.prayer_checkins for all
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- PRAYER GROUPS
-- ─────────────────────────────────────────
create type group_type as enum ('team', 'event', 'school');

create table if not exists public.prayer_groups (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  type        group_type not null default 'team',
  description text,
  sport       text,
  school      text,
  created_by  uuid references auth.users(id) on delete set null,
  event_date  date,
  is_private  boolean default false,
  invite_code text unique default upper(substr(md5(random()::text), 1, 6)),
  created_at  timestamptz default now() not null
);

alter table public.prayer_groups enable row level security;

create policy "Authenticated users can read public groups"
  on public.prayer_groups for select
  using (auth.role() = 'authenticated' and (is_private = false or created_by = auth.uid()));

create policy "Authenticated users can create groups"
  on public.prayer_groups for insert
  with check (auth.uid() = created_by);

create policy "Group creator can update"
  on public.prayer_groups for update
  using (auth.uid() = created_by);

-- ─────────────────────────────────────────
-- GROUP MEMBERS
-- ─────────────────────────────────────────
create table if not exists public.group_members (
  id         uuid primary key default uuid_generate_v4(),
  group_id   uuid references public.prayer_groups(id) on delete cascade not null,
  user_id    uuid references auth.users(id) on delete cascade not null,
  role       text default 'member' check (role in ('leader', 'member')),
  joined_at  timestamptz default now() not null,
  unique (group_id, user_id)
);

alter table public.group_members enable row level security;

create policy "Members can see their own memberships"
  on public.group_members for select
  using (auth.uid() = user_id);

create policy "Users can join groups"
  on public.group_members for insert
  with check (auth.uid() = user_id);

create policy "Users can leave groups"
  on public.group_members for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- PRAYER REQUESTS
-- ─────────────────────────────────────────
create table if not exists public.prayer_requests (
  id           uuid primary key default uuid_generate_v4(),
  group_id     uuid references public.prayer_groups(id) on delete cascade not null,
  user_id      uuid references auth.users(id) on delete cascade not null,
  body         text not null,
  is_anonymous boolean default false,
  is_answered  boolean default false,
  created_at   timestamptz default now() not null
);

alter table public.prayer_requests enable row level security;

create policy "Group members can read prayer requests"
  on public.prayer_requests for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.group_members gm
      where gm.group_id = prayer_requests.group_id
      and gm.user_id = auth.uid()
    )
  );

create policy "Users can create prayer requests in their groups"
  on public.prayer_requests for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.group_members gm
      where gm.group_id = prayer_requests.group_id
      and gm.user_id = auth.uid()
    )
  );

create policy "Users can update their own requests"
  on public.prayer_requests for update
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- DEVOTIONAL SEEDS (Mon–Sun)
-- ─────────────────────────────────────────
insert into public.devotionals (title, scripture, scripture_ref, body, reflection_prompt, sport_tags, day_index) values
(
  'Strength in the Grind',
  'I can do all things through Christ who strengthens me.',
  'Philippians 4:13',
  'That verse gets quoted on every sports poster, every pregame speech, every warm-up playlist. But Paul wrote it from a prison cell, not from a podium. He wasn''t talking about winning. He was talking about contentment — the kind that doesn''t depend on the scoreboard, the starting lineup, or whether your coach even noticed you today.

The real power of this verse is that it covers both outcomes. When you crush the workout, He''s there. When you can''t get off the bench, He''s there. When the season ends early and it wasn''t what you hoped — He is still there. Contentment in Christ means your identity doesn''t live or die with your performance.

That is a level of freedom most athletes never experience. Today, before you lace up, ask yourself: what am I trying to prove today, and to whom?',
  'What are you trying to earn today that God has already given you?',
  '{}',
  0 -- Sunday
),
(
  'Running on Empty',
  'He gives strength to the weary and increases the power of the weak.',
  'Isaiah 40:29',
  'There''s a specific kind of exhaustion that only athletes know. It''s not just physical. It''s the kind that shows up mid-season when you''ve been pushing for months. The kind where you drag yourself to practice not because you want to, but because you know you have to. Your body is asking questions your mind isn''t ready to answer.

Isaiah wrote this to a nation that had been through a long, grinding exile. Not a bad week — years of weariness. And the promise wasn''t "try harder." It was "I will give." The strength that carries you through the hardest parts of a season is not something you manufacture. It is something you receive.

Today may be a full tank day. Or it may be a running-on-empty day. Either way, the source is the same.',
  'Where are you most depleted right now — physically, mentally, or spiritually?',
  '{}',
  1 -- Monday
),
(
  'Before the Whistle Blows',
  'Be still and know that I am God.',
  'Psalm 46:10',
  'The minutes before competition are loud. Your mind is running through scenarios, your heart rate is up, coaches are talking, music is playing, teammates are moving. Everything in sports culture tells you to get hyped, get locked in, get ready to compete.

But there is a different kind of readiness. The kind that comes from stillness. From the ten seconds before the game where you close your eyes, take one breath, and remember who made you and why you play.

Being still doesn''t mean being passive. It means rooting yourself so deeply in who God is that the pressure of the moment loses its grip on your peace. The athlete who knows who they are before the whistle blows competes differently than the one who is still figuring it out at tipoff.',
  'Can you find thirty seconds of stillness before your next practice or game? What does God want you to hear in it?',
  '{}',
  2 -- Tuesday
),
(
  'After the Loss',
  'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
  'Psalm 34:18',
  'Losses hit differently in sports. Not because the stakes are always huge, but because you gave something real to be there. Hours of practice. Early mornings. Saying no to things so you could be ready. And then it doesn''t go the way you poured yourself into.

The silence of a locker room after a tough loss is one of the loneliest sounds there is. But that verse says something remarkable — God isn''t far from that moment. He is close. Not in a distant, "everything happens for a reason" way. Close. Present. Near.

Grief after a loss is not weakness. It means you cared. And the God who made you for this cares about what you care about. You don''t have to pretend you''re fine. You''re allowed to bring the real weight of it to Him.',
  'Is there a loss — in sports or in life — that you''re still carrying? What would it look like to bring it to God instead of just pushing through?',
  '{}',
  3 -- Wednesday
),
(
  'The Teammate Nobody Sees',
  'Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves.',
  'Philippians 2:3',
  'On every team, there are players who get the headlines and players who make the headlines possible. The one who sets the screen so someone else gets the layup. The one who picks up the extra conditioning without being asked. The one who encourages a struggling teammate instead of protecting their own starting spot.

That kind of athlete is rare. And it is deeply Christlike. Paul wrote Philippians 2 to a church, but it reads like a locker room devotional. The humility he describes is not self-erasure — it is choosing to see others clearly, to consider their flourishing as something worth working for.

Some of the most influential Christians in a school have no idea they''re being watched. They''re just showing up, competing hard, and treating people well. That''s a witness that doesn''t need words.',
  'Who on your team could you encourage this week — not because they''ll remember it, but because it''s the right thing to do?',
  '{}',
  4 -- Thursday
),
(
  'Injury and Trust',
  'Trust in the Lord with all your heart and lean not on your own understanding.',
  'Proverbs 3:5',
  'Nothing disrupts an athlete''s identity faster than injury. One moment you''re in the middle of something you''ve built for years. The next, you''re in a waiting room, on crutches, watching practice from the sideline. The season you planned — gone. The timeline you had — reset.

Trusting God with injury is one of the hardest forms of faith an athlete can practice. Because you can''t see the plan. You can''t understand the timing. The leaning in this verse is not passive — it is active. It is choosing, every day you''re in recovery, to put your weight on something more stable than your own ability to figure it out.

Some of the deepest spiritual growth in an athlete''s life happens on the sideline. It is there that God gets to show you He is enough — even when the sport isn''t available.',
  'What are you trying to control right now that might need to be released?',
  '{}',
  5 -- Friday
),
(
  'A Team That Prays Together',
  'Again, truly I tell you that if two of you on earth agree about anything they ask for, it will be done for them by my Father in heaven.',
  'Matthew 18:19',
  'There is something different about a team that prays together before a game. Not as a ritual. Not as superstition. But as a genuine acknowledgment that there is something bigger going on than a box score.

Jesus made an extraordinary promise in this verse. Where two or three gather in His name, there He is. That includes a huddle on a gym floor. That includes a locker room before a big tournament. That includes two athletes on a team bus who bow their heads together before tip-off.

You don''t need a perfect theology to start this. You need one other person and thirty seconds of honesty. If you''re the one on your team who believes, you may be the one God is asking to create the space — the prayer circle, the group chat, the pregame moment. Someone has to go first.',
  'Is there one teammate you could invite to pray with you before your next game?',
  '{}',
  6 -- Saturday
);
