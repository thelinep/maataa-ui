# Recording the ISL help videos

The **Sign language** panel in MAATAA (toolbar button, or `Alt+Shift+L`) shows a short Indian Sign Language (ISL)
video for the page the user is on. Until a video is recorded, the panel shows the written transcript only. This
guide covers how to record the videos and add them to the app. No code changes are needed.

## Who should sign

- A qualified ISL interpreter or a Deaf signer who is fluent in ISL. Do not use an avatar or machine signing.
- Ideally review each video with at least one Deaf ISL user before publishing.
- Get written consent from the signer to publish their likeness, and agree how they are credited.

## What to sign

Each topic's script is in `src/accessibility/sign-language/topics.ts` (`script` in English, `scriptHi` in Hindi).
The scripts are a starting point: the signer should translate the meaning into natural ISL, not sign word by word.
Keep each video under about 90 seconds.

| Topic id | Shown on |
| --- | --- |
| `welcome` | any page without its own topic |
| `concepts` | /concepts |
| `scripts` | /scripts |
| `storyboards` | /storyboards |
| `filming` | /filming, /filming/dailies |
| `screenings` | /screenings |
| `editing` | /editing |
| `color` | /color |
| `sound` | /sound |
| `projects` | /projects, /teams, /budgets |
| `accessibility` | /help/accessibility |

## Filming

- **Framing:** waist up, with space above the head and both elbows fully in frame. Signing space must never be cut off.
- **Background:** plain, single colour, contrasting with skin tone (mid-blue or dark grey works well). No patterns.
- **Clothing:** plain, long-sleeved, contrasting with skin and background. No jewellery that distracts.
- **Light:** soft, even light on the face and hands; no shadows across the face. Facial expression is grammar in ISL.
- **Camera:** fixed on a tripod at chest height, 1080p, at least 30 fps (50/60 fps preferred so fast hand shapes stay sharp).
- **Audio:** not needed. If you add a voice-over, keep it as a separate track.

## Exporting

- MP4 (H.264), 1920×1080 or 1280×720, 30–60 fps, about 4–6 Mbit/s. Keep the original master files.
- File name = topic id: `public/isl/screenings.mp4`.
- Optional poster image (shown before playback): `public/isl/screenings.jpg`, and `"poster": true` in the manifest entry.

## Captions

Every video needs captions so hearing viewers and people learning ISL can follow, and so the content is searchable.

- WebVTT format, one file per language: `public/isl/screenings.en.vtt`, `public/isl/screenings.hi.vtt`.
- Caption the meaning of what is signed, in sync with the signing.

```
WEBVTT

00:00:00.000 --> 00:00:04.000
Screenings are where you show the film and collect feedback.
```

## Adding a video to the app

Add an entry to `public/isl/manifest.json`. The panel reads this file at runtime:

```json
{
  "language": "ISL",
  "videos": [
    { "id": "screenings", "signer": "Name of signer", "captions": ["en", "hi"] }
  ]
}
```

- `id` must match a topic id from the table above.
- `signer` is shown as the credit under the video.
- `captions` lists the caption files that exist for that video.

Topics without an entry show "(transcript only)" in the topic list.

## Checklist before publishing

- [ ] Reviewed by a Deaf ISL user
- [ ] Signer's consent and credit agreed
- [ ] Captions in English and Hindi, in sync
- [ ] Hands and face visible throughout; no cropped signs
- [ ] Manifest entry added and checked in the app (Sign language panel, the right page)
- [ ] Transcript in `topics.ts` still matches what is signed
