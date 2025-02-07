import { Meta, StoryObj } from "@storybook/react";
import { EmailVerification } from "./EmailVerification";

const meta: Meta = {
  component: EmailVerification,
};

export default meta;

type Story = StoryObj<typeof EmailVerification>;

export const Default: Story = {
  args: {
    userEmail: "example@example.com",
  },
};
