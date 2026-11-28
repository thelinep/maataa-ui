import type { Meta, StoryObj } from "@storybook/react-vite";
import { CadPlanViewer } from "./CadPlanViewer";
import { parseDxf } from "./dxf";
import { STUDIO_PLAN_DXF } from "./studioPlan.fixture";

const plan = parseDxf(STUDIO_PLAN_DXF);

const meta = {
  title: "Maps/CadPlanViewer",
  component: CadPlanViewer,
  tags: ["autodocs"],
  args: { drawing: plan, label: "Studio 4, ground floor" },
} satisfies Meta<typeof CadPlanViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A DXF floor plan: walls, doors (blocks), columns, a curved counter, labels and a lighting grid. Measure snaps to corners. */
export const Default: Story = {};

/** Starts with the rigging layer hidden. */
export const LayerHidden: Story = { args: { initialHiddenLayers: ["RIGGING"] } };

/** Empty, with the Open DXF button. DWG files get a plain explanation. */
export const Empty: Story = { args: { drawing: null } };
