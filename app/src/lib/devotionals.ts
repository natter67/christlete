export interface Devotional {
  id: string;
  title: string;
  scripture: string;
  scripture_ref: string;
  body: string;
  reflection_prompt: string;
  sport_tag: string | null;
  day_of_week: number; // 0=Sun, 1=Mon, ... 6=Sat
}

export const devotionals: Devotional[] = [
  {
    id: 'dev-sun',
    day_of_week: 0,
    title: 'Rest Is Sacred',
    scripture:
      '"Come to me, all you who are weary and burdened, and I will give you rest."',
    scripture_ref: 'Matthew 11:28',
    body:
      'The world tells athletes that rest is weakness — that more reps, more film, more grind is always the answer. But God built rest into creation itself. He rested on the seventh day not because He was tired, but to show us that stillness is holy. Your body needs recovery. Your soul needs Sundays. Today, lay down the scoreboard, the ranking, the pressure. Let God speak into the quiet.',
    reflection_prompt:
      'What does real rest look like for you today? Where do you need to let go of striving and simply receive?',
    sport_tag: null,
  },
  {
    id: 'dev-mon',
    day_of_week: 1,
    title: 'Strength for the Week',
    scripture:
      '"I can do all things through Christ who strengthens me."',
    scripture_ref: 'Philippians 4:13',
    body:
      'Monday hits different as an athlete. New practice schedule, new film sessions, new expectations. But this verse isn\'t about physical strength alone — Paul wrote it from prison, not a weight room. "All things" includes hard conversations with coaches, staying composed after a bad game, showing up when you don\'t feel like it. Christ\'s strength fills your gaps. Start the week with that truth.',
    reflection_prompt:
      'What feels impossibly heavy this week? Hand that specific thing to God right now and ask for His strength to carry it.',
    sport_tag: null,
  },
  {
    id: 'dev-tue',
    day_of_week: 2,
    title: 'Playing for an Audience of One',
    scripture:
      '"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."',
    scripture_ref: 'Colossians 3:23',
    body:
      'The stands can be empty. The scout might not show up. Your coach might not notice the extra reps. But God sees every step you take in practice, every moment you choose character over shortcuts. When you play for an audience of one — when your motivation shifts from performance to worship — the game transforms. Excellence becomes an act of praise. Run your route with everything you have, not for the stat line, but for the One who made you to run.',
    reflection_prompt:
      'Who are you really playing for right now? Ask God to shift your motivation from approval to worship this week.',
    sport_tag: null,
  },
  {
    id: 'dev-wed',
    day_of_week: 3,
    title: 'Valleys and Victories',
    scripture:
      '"Even though I walk through the darkest valley, I will fear no evil, for you are with me."',
    scripture_ref: 'Psalm 23:4',
    body:
      'Slumps are real. Bad stretches happen. Injuries, mental blocks, losing streaks — every athlete walks through valleys. David knew valleys too. He wasn\'t writing from a mountaintop; he wrote from the hard places. And what he found there was not rescue from the valley but presence in it. God doesn\'t always remove the hard season. He walks through it with you. The valley is not where you are abandoned — it\'s where you learn to trust.',
    reflection_prompt:
      'What valley are you in right now — physically, emotionally, or spiritually? Ask God to make Himself known to you in that specific place.',
    sport_tag: null,
  },
  {
    id: 'dev-thu',
    day_of_week: 4,
    title: 'Iron Sharpens Iron',
    scripture:
      '"As iron sharpens iron, so one person sharpens another."',
    scripture_ref: 'Proverbs 27:17',
    body:
      'Your teammates are not just competition. They are gifts. The friction of honest practice, the challenge of a better player at your position, the teammate who calls you out when your effort drops — this is how God shapes you. Sharpening is not always comfortable. Iron on iron creates heat and sparks. But the result is a sharper edge. Look at the person beside you at practice differently today: they are part of God\'s process in you.',
    reflection_prompt:
      'Who in your life is currently sharpening you? Have you thanked God for that person, even if the friction is uncomfortable?',
    sport_tag: null,
  },
  {
    id: 'dev-fri',
    day_of_week: 5,
    title: 'Pregame Peace',
    scripture:
      '"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."',
    scripture_ref: 'Philippians 4:6-7',
    body:
      'Game day nerves are real. Your heart rate rises, your mind races through scenarios. Paul knew anxiety — he wrote this letter in chains. And his answer is not "calm down" or "you\'ve got this." His answer is prayer. Not a performance prayer. Not a bargaining prayer. A thankful prayer. You bring God your anxious heart and a list of requests. He trades you peace for it. Not peace that makes sense, but a supernatural calm that guards you from the inside out. Before you warm up today, pray.',
    reflection_prompt:
      'What specific anxiety about today\'s competition do you want to hand to God? Write it down and speak it out loud to Him.',
    sport_tag: null,
  },
  {
    id: 'dev-sat',
    day_of_week: 6,
    title: 'Win or Lose, You Are Loved',
    scripture:
      '"For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord."',
    scripture_ref: 'Romans 8:38-39',
    body:
      'Scoreboard goes final. No matter what it reads, this verse does not change. God\'s love for you is not tied to your performance, your win-loss record, or whether you had the best game of your life or the worst. Athletes are wired to evaluate worth by results — but God doesn\'t operate that way. You were loved before you scored a point. You will be loved after your last game. Play hard today. Compete with everything in you. And when the final whistle blows, know that nothing on that scoreboard touches your standing before God.',
    reflection_prompt:
      'Do you believe God loves you the same whether you win or lose today? What would change about how you compete if you truly believed that?',
    sport_tag: null,
  },
];

export function getTodaysDevotional(): Devotional {
  const day = new Date().getDay(); // 0=Sun, 6=Sat
  return devotionals.find((d) => d.day_of_week === day) ?? devotionals[0];
}
