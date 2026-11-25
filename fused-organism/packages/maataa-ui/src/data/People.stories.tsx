import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { BeingAvatar } from "./BeingAvatar";
import { CrewIdCard, type CrewPerson } from "./CrewIdCard";
import { CrewProfile, type CrewProfileProps } from "./CrewProfile";

const asha: CrewPerson = {
  id: "VFS-0142",
  name: "Asha Rao",
  designation: "1st Assistant Camera",
  department: "Camera",
  phone: "+91 98100 11111",
  email: "asha@example.com",
};
const moti: CrewPerson = {
  id: "VFS-A07",
  name: "Moti",
  designation: "Animal actor (plays Sheru)",
  department: "Animal handling",
  species: ["dog"],
};

const profile: CrewProfileProps = {
  person: asha,
  credits: [
    { title: "Bhairav", role: "1st AC", year: 2026 },
    { title: "Kabir Nagar Diaries", role: "Focus puller", year: 2025 },
  ],
  tools: [
    { name: "Follow focus", detail: "Tilta Nucleus-M", owned: true },
    { name: "Monitor", detail: 'SmallHD 7"', owned: true },
  ],
  utils: [
    { label: "Languages", value: "Hindi, Marathi, English" },
    { label: "Driving licence", value: "Car and two-wheeler" },
    { label: "Passport", value: "Valid to 2031" },
  ],
  rating: {
    value: 4.6,
    count: 12,
    reviews: [
      {
        author: "DOP, Bhairav",
        rating: 5,
        text: "Never missed a mark on long takes.",
        date: new Date(2026, 9, 2),
      },
    ],
  },
  rates: [
    { label: "Day rate (12 hours)", amount: 9000 },
    { label: "Overtime per hour", amount: 1100 },
    { label: "With own focus kit", amount: 11500, note: "Wireless follow focus and monitor" },
  ],
  callSheets: [
    {
      id: "c1",
      date: new Date(2026, 10, 26),
      callTime: "06:30",
      location: "Film City, Studio 4",
      status: "confirmed",
    },
    {
      id: "c2",
      date: new Date(2026, 10, 27),
      callTime: "07:00",
      location: "Aarey Colony",
      status: "published",
    },
  ],
  booked: [new Date(2026, 10, 26), new Date(2026, 10, 27)],
  documents: [
    { id: "d1", name: "Contract", status: "signed", expires: new Date(2027, 2, 31) },
    { id: "d2", name: "NDA", status: "pending" },
  ],
  emergency: { name: "Ravi Rao", relation: "Brother", phone: "+91 98100 22222" },
  health: [{ label: "Fit to work", state: "ok", date: new Date(2026, 10, 1) }],
  production: "Bhairav",
  organisation: "Vesahe Film Solutions",
  validUntil: new Date(2027, 2, 31),
};

const meta = {
  title: "Data/People",
  component: CrewProfile,
  tags: ["autodocs"],
  args: profile,
} satisfies Meta<typeof CrewProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

/** What most of the crew sees: no Health tab. */
export const Profile: Story = {};

/** For production and medical roles. */
export const ProfileWithHealth: Story = { args: { canSeeHealth: true, defaultTab: "health" } };

/** The iCard tab: front and back, printable at 54 × 85.6 mm. */
export const ICard: Story = {
  render: () => (
    <CrewIdCard
      person={asha}
      production="Bhairav"
      organisation="Vesahe Film Solutions"
      validUntil={new Date(2027, 2, 31)}
      emergency={{ name: "Ravi Rao", relation: "Brother", phone: "+91 98100 22222" }}
      qrValue="https://tlps.in/crew/VFS-0142"
    />
  ),
};

/** An animal actor's card, in Hindi. */
export const AnimalICardHindi: Story = {
  render: () => (
    <LocaleProvider locale="hi-IN">
      <CrewIdCard
        person={moti}
        production="Bhairav"
        organisation="Vesahe Film Solutions"
        validUntil={new Date(2026, 11, 31)}
        emergency={{ name: "Sunil Jadhav", relation: "Handler", phone: "+91 98200 33333" }}
      />
    </LocaleProvider>
  ),
};

/** Avatars: a person, an animal with health shown, a hybrid character, and a game avatar. */
export const Avatars: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <BeingAvatar name="Asha Rao" species={["human"]} subtitle="1st Assistant Camera" />
      <BeingAvatar
        name="Moti"
        species={["dog"]}
        subtitle="Plays Sheru"
        showHealth
        health={[
          {
            label: "Vet check",
            state: "ok",
            date: new Date(2026, 10, 20),
            detail: "Dr. Kulkarni, fit for stunts",
          },
          { label: "Rest between takes", state: "watch", detail: "15 minutes after every 3 takes" },
        ]}
      />
      <BeingAvatar
        name="Vyom"
        species={["human", "robot"]}
        variant="character"
        vitality={35}
        subtitle="Lead character, act 3"
      />
      <BeingAvatar
        name="Garuda"
        species={["creature"]}
        variant="game"
        vitality={80}
        subtitle="Boss level"
      />
    </div>
  ),
};
