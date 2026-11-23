import type { Meta, StoryObj } from "@storybook/react-vite";
import { CallSheetPrintView } from "./CallSheetPrintView";

const meta = {
  title: "Data/CallSheetPrintView",
  component: CallSheetPrintView,
  tags: ["autodocs"],
} satisfies Meta<typeof CallSheetPrintView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    production: "Monsoon Diaries",
    version: 2,
    day: {
      shootDay: 4,
      of: 18,
      date: "Tue 24 Nov 2026",
      crewCall: "06:00",
      shootingCall: "07:30",
      sunrise: "06:52",
      sunset: "17:58",
      weather: "Clear, 29°C",
      basecamp: "Bandra Reclamation",
      hospital: "Lilavati Hospital, Bandra · 022 2675 1000",
    },
    scenes: [
      {
        id: "a",
        scene: "12",
        set: "INT. MEERA'S KITCHEN",
        dayNight: "D",
        pages: "1 3/8",
        cast: "1, 4",
        location: "Bandra bungalow",
      },
      {
        id: "b",
        scene: "14",
        set: "EXT. TERRACE",
        dayNight: "E",
        pages: "2",
        cast: "1, 2",
        location: "Bandra bungalow",
      },
    ],
    cast: [
      { role: "1 · Meera", name: "Asha Rao", call: "06:30" },
      { role: "2 · Arjun", name: "Ravi Menon", call: "09:00" },
    ],
    crew: [
      { role: "Director", name: "PHKD", call: "06:00" },
      { role: "DOP", name: "Meera Iyer", call: "06:00", phone: "+91 98xxxxxx10" },
    ],
    notes: "Rain cover on standby. Quiet on set during the kitchen dialogue.",
  },
};
