import type { Meta, StoryObj } from "@storybook/react-vite";
import { CallSheetEditor } from "./CallSheetEditor";

const meta = {
  title: "Forms/CallSheetEditor",
  component: CallSheetEditor,
  tags: ["autodocs"],
} satisfies Meta<typeof CallSheetEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onDayChange: () => {},
    onScenesChange: () => {},
    day: {
      shootDay: 4,
      of: 18,
      date: "2026-11-24",
      crewCall: "06:00",
      shootingCall: "07:30",
      sunrise: "06:52",
      sunset: "17:58",
      weather: "Clear, 29°C",
      basecamp: "Bandra Reclamation",
      hospital: "Lilavati Hospital, Bandra",
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
      {
        id: "c",
        scene: "15A",
        set: "EXT. LANE",
        dayNight: "N",
        pages: "4/8",
        cast: "2",
        location: "Chapel Road",
      },
    ],
  },
};
