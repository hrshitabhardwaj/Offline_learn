import { TOPIC_IDS } from '@/data/content';

export const RECOMMENDATION_CONFIG = {
  weakThreshold: 40,
  needsPracticeUpper: 70,
  labels: {
    weak: 'Weak topic',
    needsPractice: 'Needs practice',
    good: 'Good understanding',
  },
  statuses: {
    weak: 'Weak',
    needsPractice: 'Needs practice',
    good: 'Good',
  },
} as const;

export type TopicScore = { topic: string; scorePercent: number };
export type RecommendationLevel = 'weak' | 'needsPractice' | 'good';

export type Recommendation = {
  topic: string;
  level: RecommendationLevel;
  statusLabel: string;
  headline: string;
  steps: string[];
  reason: string;
};

export type RecommendationsResult = {
  recommendations: Recommendation[];
  nextTopic: string | null;
};

function levelForScore(score: number): RecommendationLevel {
  if (score < RECOMMENDATION_CONFIG.weakThreshold) return 'weak';
  if (score <= RECOMMENDATION_CONFIG.needsPracticeUpper) return 'needsPractice';
  return 'good';
}

function stepsForLevel(level: RecommendationLevel): string[] {
  switch (level) {
    case 'weak':
      return [
        'Revise the concept lessons',
        'Try the basic practice set',
        'Take the quiz again',
        'Reassess to confirm improvement',
      ];
    case 'needsPractice':
      return [
        'Work through the additional practice questions',
        'Reassess to check your progress',
      ];
    case 'good':
      return [
        'Try the advanced practice set for a challenge',
        'Or move on to the next topic',
      ];
  }
}

export function classifyScore(
  score: number,
): { level: RecommendationLevel; statusLabel: string } {
  const level = levelForScore(score);
  return {
    level,
    statusLabel: RECOMMENDATION_CONFIG.statuses[level],
  };
}

export function buildRecommendations(
  scores: TopicScore[],
  completedTopicIds: string[] = [],
): RecommendationsResult {
  const recommendations: Recommendation[] = [];

  const byTopic = new Map<string, number>();
  for (const s of scores) byTopic.set(s.topic, s.scorePercent);

  for (const topic of TOPIC_IDS) {
    if (!byTopic.has(topic)) continue;
    const score = byTopic.get(topic)!;
    const level = levelForScore(score);
    if (level === 'good') continue; // only surface topics that need attention
    recommendations.push({
      topic,
      level,
      statusLabel: RECOMMENDATION_CONFIG.statuses[level],
      headline:
        level === 'weak'
          ? `${topicLabel(topic)}: focus needed`
          : `${topicLabel(topic)}: a little more practice`,
      steps: stepsForLevel(level),
      reason: `${topicLabel(topic)}: ${score}%, ${
        level === 'weak'
          ? `below ${RECOMMENDATION_CONFIG.weakThreshold}%`
          : `between ${RECOMMENDATION_CONFIG.weakThreshold}% and ${RECOMMENDATION_CONFIG.needsPracticeUpper}%`
      }.`,
    });
  }

  recommendations.sort((a, b) => {
    const order = { weak: 0, needsPractice: 1, good: 2 } as const;
    if (order[a.level] !== order[b.level]) return order[a.level] - order[b.level];
    const sa = byTopic.get(a.topic) ?? 0;
    const sb = byTopic.get(b.topic) ?? 0;
    return sa - sb;
  });

  const nextTopic =
    TOPIC_IDS.find((t) => !completedTopicIds.includes(t) && !byTopic.has(t)) ??
    null;

  return { recommendations, nextTopic };
}

export function topicLabel(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
