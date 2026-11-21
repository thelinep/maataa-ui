import type { Meta, StoryObj } from "@storybook/react";
import { ContactForm, NewsletterSignup } from "./ContactBlocks";

const meta = { title: "Forms/ContactBlocks", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <ContactForm onSubmit={() => {}} />
      <NewsletterSignup
        onSubscribe={() => {}}
        blurb="Festival deadlines, funding calls and new features."
      />
    </div>
  ),
};
