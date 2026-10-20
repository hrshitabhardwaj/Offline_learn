// Reference videos per topic and language.
// Replace REPLACE_ME with real YouTube video IDs.
// Format: VIDEOS[topicId][lang] = [{ title, url, source }]
// url is a full YouTube watch URL; the app extracts the video id for the embed.
// If a language is missing, the app falls back to English, then to any available language.

import type { Lang } from '@/lib/i18n';

export type VideoRef = {
  title: string;
  url: string;
  source: string;
};

export const VIDEOS: Record<string, Partial<Record<Lang, VideoRef[]>>> = {
  fractions: {
    en: [
      {
        title: 'Fractions — basics and operations',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    hi: [
      {
        title: 'भिन्न — मूल बातें और संक्रियाएँ',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    bn: [
      {
        title: 'ভগ্নাংশ — ভিত্তি ও প্রক্রিয়া',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    mr: [
      {
        title: 'अपूर्णांक — मूलभूत आणि संक्रिया',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    te: [
      {
        title: 'భిన్నాలు — ప్రాథమికాలు మరియు క్రియలు',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    ta: [
      {
        title: 'பின்னங்கள் — அடிப்படை மற்றும் செயல்பாடுகள்',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
  },
  algebra: {
    en: [
      {
        title: 'Algebraic expressions — introduction',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    hi: [
      {
        title: 'बीजीय व्यंजक — परिचय',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    bn: [
      {
        title: 'বীজগাণিতিক রাশি — পরিচিতি',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    mr: [
      {
        title: 'बीजीय व्यंजक — परिचय',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    te: [
      {
        title: 'బీజీయ వ్యక్తులు — పరిచయం',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    ta: [
      {
        title: 'இயற்கணித வெளிப்பாடுகள் — அறிமுகம்',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
  },
  geometry: {
    en: [
      {
        title: 'Angles in triangles and polygons',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    hi: [
      {
        title: 'त्रिभुज और बहुभुज में कोण',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    bn: [
      {
        title: 'ত্রিভুজ ও বহুভুজে কোণ',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    mr: [
      {
        title: 'त्रिकोण आणि बहुभुजातील कोन',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    te: [
      {
        title: 'త్రిభుజాలు మరియు బహుభుజులలో కోణాలు',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    ta: [
      {
        title: 'முக்கோணம் மற்றும் பல்கோணங்களில் கோணங்கள்',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
  },
  'linear-equations': {
    en: [
      {
        title: 'Solving linear equations',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    hi: [
      {
        title: 'रैखिक समीकरण हल करना',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    bn: [
      {
        title: 'একঘাত সমীকরণ সমাধান',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    mr: [
      {
        title: 'रेषीय समीकरणे सोडवणे',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    te: [
      {
        title: 'రేఖీయ సమీకరణాలు సాధించడం',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
    ta: [
      {
        title: 'நேரியல் சமன்பாடுகளைத் தீர்த்தல்',
        url: 'https://www.youtube.com/watch?v=REPLACE_ME',
        source: 'YouTube',
      },
    ],
  },
};

export function resolveVideos(
  topicId: string,
  lang: Lang,
): { videos: VideoRef[]; resolvedLang: Lang | null } {
  const topicVideos = VIDEOS[topicId];
  if (!topicVideos) return { videos: [], resolvedLang: null };
  const byLang = topicVideos[lang];
  if (byLang && byLang.length > 0) {
    const valid = byLang.filter((v) => !v.url.includes('REPLACE_ME'));
    if (valid.length > 0) return { videos: valid, resolvedLang: lang };
  }
  if (lang !== 'en') {
    const enVideos = topicVideos.en;
    if (enVideos) {
      const valid = enVideos.filter((v) => !v.url.includes('REPLACE_ME'));
      if (valid.length > 0) return { videos: valid, resolvedLang: 'en' };
    }
  }
  for (const l of Object.keys(topicVideos) as Lang[]) {
    const list = topicVideos[l];
    if (list) {
      const valid = list.filter((v) => !v.url.includes('REPLACE_ME'));
      if (valid.length > 0) return { videos: valid, resolvedLang: l };
    }
  }
  return { videos: [], resolvedLang: null };
}

export function youtubeIdFromUrl(url: string): string | null {
  const m = url.match(/[?&]v=([^&]+)/);
  return m ? m[1] : null;
}
