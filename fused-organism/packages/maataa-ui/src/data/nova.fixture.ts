/**
 * A shot list and a call sheet exactly as Maataa Workstation's skills return
 * them: produced by running nova-console's skills/shotlist.js and
 * skills/callsheet.js (brahmini 10547e0) with a stand-in model reply, and
 * accepted by their own validators without repair. For tests and stories only.
 */

/** Result of skills/shotlist.js run() */
export const NOVA_SHOT_LIST_RESULT = {
  kind: "shotlist",
  data: {
    title: "Bhairav",
    scenes: [
      {
        scene: "1",
        heading: "EXT. ASSI GHAT - DAWN",
        shots: [
          {
            shot: "1A",
            size: "WS",
            angle: "high angle",
            movement: "slow crane down",
            description: "Mist over the river as the first boats push off from the ghat.",
            lens: "24mm",
            durationSec: 8,
            notes: "Golden hour, 06:10",
          },
          {
            shot: "1B",
            size: "MS",
            angle: "eye level",
            movement: "static",
            description: "Bhairav lowers a diya onto the water.",
            lens: "50mm",
            durationSec: 5,
            notes: "",
          },
          {
            shot: "1C",
            size: "CU",
            angle: "low angle",
            movement: "handheld",
            description: "The flame steadies, then drifts away.",
            lens: "TBC",
            durationSec: 3,
            notes: "",
          },
        ],
      },
      {
        scene: "2",
        heading: "आंतरिक. माँ की रसोई - रात",
        shots: [
          {
            shot: "2A",
            size: "WS",
            angle: "eye level",
            movement: "static",
            description: "रसोई में अकेली लालटेन जल रही है।",
            lens: "TBC",
            durationSec: 6,
            notes: "",
          },
          {
            shot: "2B",
            size: "OTS",
            angle: "eye level",
            movement: "slow push in",
            description: "माँ भैरव की ओर बिना देखे रोटी बेलती रहती है।",
            lens: "85mm",
            durationSec: 7,
            notes: "",
          },
          {
            shot: "2C",
            size: "ECU",
            angle: "eye level",
            movement: "static",
            description: "माँ की आँखों में आँसू।",
            lens: "100mm macro",
            durationSec: 4,
            notes: "One take only",
          },
        ],
      },
    ],
  },
  markdown:
    "# Shot list: Bhairav\n\n## Scene 1: EXT. ASSI GHAT - DAWN\n\n| Shot | Size | Angle | Movement | Lens | Description | Sec | Notes |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n| 1A | WS | high angle | slow crane down | 24mm | Mist over the river as the first boats push off from the ghat. | 8 | Golden hour, 06:10 |\n| 1B | MS | eye level | static | 50mm | Bhairav lowers a diya onto the water. | 5 |  |\n| 1C | CU | low angle | handheld | TBC | The flame steadies, then drifts away. | 3 |  |\n\n## Scene 2: आंतरिक. माँ की रसोई - रात\n\n| Shot | Size | Angle | Movement | Lens | Description | Sec | Notes |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n| 2A | WS | eye level | static | TBC | रसोई में अकेली लालटेन जल रही है। | 6 |  |\n| 2B | OTS | eye level | slow push in | 85mm | माँ भैरव की ओर बिना देखे रोटी बेलती रहती है। | 7 |  |\n| 2C | ECU | eye level | static | 100mm macro | माँ की आँखों में आँसू। | 4 | One take only |\n\n**6 shots**, about 0.6 minutes of estimated screen time.\n",
  model: "qwen3.5:9b-q4_K_M",
  repaired: false,
  sourceCharacters: 26,
  sourceTruncated: false,
};

/** Result of skills/callsheet.js run() */
export const NOVA_CALL_SHEET_RESULT = {
  kind: "callsheet",
  data: {
    production: "Bhairav",
    shootDay: "Day 2 of 5",
    date: "2026-11-27",
    generalCall: "05:30",
    location: {
      name: "Assi Ghat, Varanasi",
      address: "TBC",
      parking: "Bhadaini lane, near the water tank",
      nearestHospital: "TBC",
    },
    weather: "Fog till 08:00",
    schedule: [
      {
        time: "05:45",
        scene: "1",
        description: "EXT. ASSI GHAT - DAWN",
        cast: ["Bhairav"],
      },
      {
        time: "09:30",
        scene: "4",
        description: "Boat sequence, mid-river",
        cast: ["Bhairav", "Boatman"],
      },
      {
        time: "19:00",
        scene: "2",
        description: "आंतरिक. माँ की रसोई - रात",
        cast: ["Bhairav", "Maa"],
      },
    ],
    cast: [
      {
        name: "Rohan Mishra",
        role: "Bhairav",
        call: "05:00",
        notes: "Make-up first",
      },
      {
        name: "Sunita Devi",
        role: "Maa",
        call: "17:30",
        notes: "",
      },
    ],
    crew: [
      {
        department: "Camera",
        name: "Asha Rao",
        call: "04:45",
      },
      {
        department: "Sound",
        name: "TBC",
        call: "05:00",
      },
    ],
    notes: [
      "Life jackets for everyone on the boats",
      "No drones over the ghat without the police letter",
    ],
  },
  markdown:
    "# Call sheet: Bhairav\n\n| Day | Date | General call | Weather |\n| --- | --- | --- | --- |\n| Day 2 of 5 | 2026-11-27 | 05:30 | Fog till 08:00 |\n\n## Location\n\n- **Assi Ghat, Varanasi**, TBC\n- Parking: Bhadaini lane, near the water tank\n- Nearest hospital: TBC\n\n## Schedule\n\n| Time | Scene | Description | Cast |\n| --- | --- | --- | --- |\n| 05:45 | 1 | EXT. ASSI GHAT - DAWN | Bhairav |\n| 09:30 | 4 | Boat sequence, mid-river | Bhairav, Boatman |\n| 19:00 | 2 | आंतरिक. माँ की रसोई - रात | Bhairav, Maa |\n\n## Cast\n\n| Name | Role | Call | Notes |\n| --- | --- | --- | --- |\n| Rohan Mishra | Bhairav | 05:00 | Make-up first |\n| Sunita Devi | Maa | 17:30 |  |\n\n## Crew\n\n| Department | Name | Call |\n| --- | --- | --- |\n| Camera | Asha Rao | 04:45 |\n| Sound | TBC | 05:00 |\n\n## Notes\n\n- Life jackets for everyone on the boats\n- No drones over the ghat without the police letter\n",
  model: "qwen3.5:9b-q4_K_M",
  repaired: false,
  sourceCharacters: 20,
  sourceTruncated: false,
};

export const NOVA_SHOT_LIST = NOVA_SHOT_LIST_RESULT.data;
export const NOVA_CALL_SHEET = NOVA_CALL_SHEET_RESULT.data;
