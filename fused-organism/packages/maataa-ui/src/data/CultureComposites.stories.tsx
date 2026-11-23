import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChakraCategoryRow,
  LanguageCulturalTimeline,
  AncestralChainFlow,
  TLPClassificationCard,
  type ChakraId,
} from "./CultureComposites";

const meta = { title: "Data/CultureComposites", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const cats: [ChakraId, string, number][] = [
  ["root", "Village and land", 14],
  ["sacral", "Romance", 22],
  ["solar", "Underdog sport", 9],
  ["heart", "Family drama", 31],
  ["throat", "Biopics", 7],
  ["thirdEye", "Mystery", 11],
  ["crown", "Devotional", 5],
];

export const Chakras: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 8, maxWidth: 460 }}>
      {cats.map(([c, l, n]) => (
        <ChakraCategoryRow key={c} chakra={c} category={l} count={n} onOpen={() => {}} />
      ))}
    </div>
  ),
};

export const Heritage: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <LanguageCulturalTimeline
        language="Tamil"
        eras={[
          {
            period: "c. 300 BCE – 300 CE",
            title: "Sangam literature",
            description: "Poetry of love (akam) and war (puram).",
            sample: "யாதும் ஊரே யாவரும் கேளிர்",
            sampleLang: "ta",
            transliteration: "yātum ūrē yāvarum kēḷir",
          },
          {
            period: "6th–9th century",
            title: "Bhakti hymns",
            description: "Devotional songs of the Alvars and Nayanars.",
          },
          {
            period: "20th century",
            title: "Tamil cinema",
            description: "From Kalidas (1931) to today.",
          },
        ]}
      />
      <AncestralChainFlow
        title="Kirana gharana"
        direction="horizontal"
        chain={[
          { id: "1", name: "Abdul Karim Khan", years: "1872–1937", relation: "Founder" },
          { id: "2", name: "Sawai Gandharva", years: "1886–1952", relation: "Disciple" },
          { id: "3", name: "Bhimsen Joshi", years: "1922–2011", relation: "Disciple" },
        ]}
      />
    </div>
  ),
};

export const TLP: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 10 }}>
      <TLPClassificationCard level="RED" title="Investor term sheet" owner="Vesahe Films" />
      <TLPClassificationCard level="AMBER" title="Budget v3" />
      <TLPClassificationCard level="GREEN" title="Crew handbook" />
      <TLPClassificationCard level="CLEAR" title="Press kit" />
    </div>
  ),
};
