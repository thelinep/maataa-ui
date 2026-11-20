/**
 * Indian Sign Language (ISL) help topics, one per area of the app.
 *
 * Each topic has a script: the plain-language text a human ISL signer
 * signs on video, also shown as a written transcript (English and Hindi).
 * Videos are recorded by people, never generated: see
 * docs/ISL-VIDEO-RECORDING-GUIDE.md. A recorded video is listed in
 * public/isl/manifest.json and served from public/isl/<id>.mp4, with
 * captions in public/isl/<id>.en.vtt (and optionally <id>.hi.vtt).
 */

export interface SignLanguageTopic {
  id: string;
  title: string;
  /** Path prefixes this topic explains; the first match wins. */
  routes: string[];
  /** Script / transcript in plain English (short sentences). */
  script: string;
  /** Script / transcript in Hindi. */
  scriptHi: string;
}

export const SIGN_LANGUAGE_TOPICS: SignLanguageTopic[] = [
  {
    id: 'welcome',
    title: 'Welcome to MAATAA',
    routes: [],
    script:
      'MAATAA helps a film team work together, from the first idea to the final sound mix. ' +
      'The menu on the left lists every step: concepts, scripts, storyboards, filming, screenings, editing, colour and sound. ' +
      'Projects, teams and budgets are under Management. ' +
      'The Accessibility button changes text size and colours, and can read the page aloud. ' +
      'This Sign language button opens help videos like this one for the page you are on.',
    scriptHi:
      'MAATAA फ़िल्म टीम को पहले आइडिया से आख़िरी साउंड मिक्स तक साथ काम करने में मदद करता है। ' +
      'बाईं ओर के मेन्यू में हर चरण है: कॉन्सेप्ट, स्क्रिप्ट, स्टोरीबोर्ड, शूटिंग, स्क्रीनिंग, एडिटिंग, कलर और साउंड। ' +
      'प्रोजेक्ट, टीम और बजट "Management" में हैं। ' +
      '"Accessibility" बटन से अक्षरों का आकार और रंग बदल सकते हैं, और पेज को पढ़कर सुनवा सकते हैं। ' +
      '"Sign language" बटन उसी पेज के लिए ऐसे वीडियो खोलता है।',
  },
  {
    id: 'concepts',
    title: 'Concepts',
    routes: ['/concepts'],
    script:
      'A concept is the idea for a film. The list shows each idea with its genre, format and status. ' +
      'Choose New Concept to add one: give it a title and describe the vision. ' +
      'Open a concept to read it, edit it, or move it from ideation to pitch to approved.',
    scriptHi:
      'कॉन्सेप्ट फ़िल्म का आइडिया है। सूची में हर आइडिया की शैली, फ़ॉर्मैट और स्थिति दिखती है। ' +
      'नया जोड़ने के लिए "New Concept" चुनें: शीर्षक दें और अपना विज़न लिखें। ' +
      'किसी कॉन्सेप्ट को खोलकर पढ़ें, बदलें, या उसे ideation से pitch और approved तक ले जाएँ।',
  },
  {
    id: 'scripts',
    title: 'Scripts',
    routes: ['/scripts'],
    script:
      'Scripts hold the screenplay for each film, with its page count and version. ' +
      'Open a script to read it. Choose Edit to write; each save keeps a version. ' +
      'A script moves from draft to locked to approved.',
    scriptHi:
      'स्क्रिप्ट में हर फ़िल्म की पटकथा होती है, पन्नों की गिनती और वर्शन के साथ। ' +
      'पढ़ने के लिए स्क्रिप्ट खोलें। लिखने के लिए "Edit" चुनें; हर सेव एक वर्शन रखता है। ' +
      'स्क्रिप्ट draft से locked और फिर approved होती है।',
  },
  {
    id: 'storyboards',
    title: 'Storyboards',
    routes: ['/storyboards'],
    script:
      'A storyboard shows the film as pictures, scene by scene and shot by shot. ' +
      'Open a storyboard to see its scenes. Each shot has a description, camera notes and timing.',
    scriptHi:
      'स्टोरीबोर्ड फ़िल्म को चित्रों में, सीन-दर-सीन और शॉट-दर-शॉट दिखाता है। ' +
      'सीन देखने के लिए स्टोरीबोर्ड खोलें। हर शॉट में विवरण, कैमरा नोट्स और समय होता है।',
  },
  {
    id: 'filming',
    title: 'Filming and dailies',
    routes: ['/filming'],
    script:
      'Filming lists each shoot day with its location, camera and shots. ' +
      'Each shot shows how many takes were filmed. ' +
      'Dailies shows the clips from each day; mark the takes to keep.',
    scriptHi:
      'शूटिंग में हर शूट-दिन की लोकेशन, कैमरा और शॉट्स हैं। ' +
      'हर शॉट में दिखता है कि कितने टेक लिए गए। ' +
      '"Dailies" में हर दिन के क्लिप हैं; जो टेक रखने हैं उन्हें चिह्नित करें।',
  },
  {
    id: 'screenings',
    title: 'Screenings',
    routes: ['/screenings'],
    script:
      'Screenings are showings of the film to the team, test audiences or a premiere. ' +
      'Open a screening to see audience feedback and ratings. ' +
      'The Accessibility section tracks captions, audio description and sign language interpretation for the film, ' +
      'and what the venue offers on the day.',
    scriptHi:
      'स्क्रीनिंग में फ़िल्म टीम, टेस्ट दर्शकों या प्रीमियर में दिखाई जाती है। ' +
      'दर्शकों की राय और रेटिंग देखने के लिए स्क्रीनिंग खोलें। ' +
      '"Accessibility" हिस्से में फ़िल्म के कैप्शन, ऑडियो डिस्क्रिप्शन और सांकेतिक भाषा अनुवाद की स्थिति, ' +
      'और उस दिन वेन्यू की सुविधाएँ दर्ज होती हैं।',
  },
  {
    id: 'editing',
    title: 'Editing',
    routes: ['/editing'],
    script:
      'Editing shows the timeline of the cut, track by track. ' +
      'The log lists each version of the edit and what changed.',
    scriptHi: 'एडिटिंग में कट की टाइमलाइन ट्रैक-दर-ट्रैक दिखती है। लॉग में एडिट का हर वर्शन और उसमें हुए बदलाव हैं।',
  },
  {
    id: 'color',
    title: 'Colour grading',
    routes: ['/color'],
    script: 'Colour grading sets the look of each scene. Choose a look, then adjust it scene by scene.',
    scriptHi: 'कलर ग्रेडिंग हर सीन का लुक तय करती है। एक लुक चुनें, फिर सीन-दर-सीन उसे बदलें।',
  },
  {
    id: 'sound',
    title: 'Sound mixing',
    routes: ['/sound'],
    script:
      'Sound mixing sets the level of dialogue, music, foley and ambience. ' +
      'Each track has a level slider, and buttons to mute it or play it alone.',
    scriptHi:
      'साउंड मिक्सिंग में संवाद, संगीत, फ़ोली और माहौल की आवाज़ का स्तर तय होता है। ' +
      'हर ट्रैक में स्तर का स्लाइडर, और उसे बंद करने या अकेले सुनने के बटन हैं।',
  },
  {
    id: 'projects',
    title: 'Projects, teams and budgets',
    routes: ['/projects', '/teams', '/budgets'],
    script:
      'Projects, teams and budgets keep the production organised. ' +
      'Each list can be searched; choose a row, or press Enter on it, to open it. ' +
      'Create adds a new one; Edit changes it.',
    scriptHi:
      'प्रोजेक्ट, टीम और बजट प्रोडक्शन को व्यवस्थित रखते हैं। ' +
      'हर सूची में खोज सकते हैं; खोलने के लिए पंक्ति चुनें या उस पर Enter दबाएँ। ' +
      '"Create" से नया बनाएँ; "Edit" से बदलें।',
  },
  {
    id: 'accessibility',
    title: 'Accessibility settings',
    routes: ['/help'],
    script:
      'The Accessibility button changes how the app looks and sounds for you. ' +
      'Make text bigger, use high contrast colours, turn off animations, or have the page read aloud in English or Hindi. ' +
      'Your choices are remembered on this device.',
    scriptHi:
      '"Accessibility" बटन से ऐप आपके लिए कैसा दिखे और सुनाई दे, यह बदल सकते हैं। ' +
      'अक्षर बड़े करें, ज़्यादा कंट्रास्ट वाले रंग चुनें, एनिमेशन बंद करें, या पेज को हिन्दी या अंग्रेज़ी में पढ़वाएँ। ' +
      'आपकी पसंद इस डिवाइस पर याद रहती है।',
  },
];

/** The topic that explains a path ("welcome" when nothing matches). */
export function topicForPath(pathname: string): SignLanguageTopic {
  return (
    SIGN_LANGUAGE_TOPICS.find((t) => t.routes.some((r) => pathname === r || pathname.startsWith(`${r}/`))) ??
    SIGN_LANGUAGE_TOPICS[0]
  );
}

export interface RecordedVideo {
  /** Topic id. */
  id: string;
  /** Who signed it, credited under the video. */
  signer?: string;
  /** Caption languages available as <id>.<lang>.vtt. */
  captions?: string[];
  /** True when a still image exists at <id>.jpg, shown before playback. */
  poster?: boolean;
}

export interface SignLanguageManifest {
  language: 'ISL';
  videos: RecordedVideo[];
}

export const MANIFEST_URL = '/isl/manifest.json';

/** Recorded videos, from public/isl/manifest.json; none if it is missing. */
export async function loadManifest(fetchImpl: typeof fetch = fetch): Promise<SignLanguageManifest> {
  try {
    const res = await fetchImpl(MANIFEST_URL, { cache: 'no-cache' });
    if (!res.ok) return { language: 'ISL', videos: [] };
    const data = (await res.json()) as Partial<SignLanguageManifest>;
    const videos = Array.isArray(data.videos)
      ? data.videos.filter((v): v is RecordedVideo => Boolean(v && typeof v.id === 'string'))
      : [];
    return { language: 'ISL', videos };
  } catch {
    return { language: 'ISL', videos: [] };
  }
}
