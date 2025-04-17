import { Meta, StoryObj } from "@storybook/react";
import { ResetPassword } from "./ResetPassword";

const meta: Meta = {
  component: ResetPassword,
};

export default meta;

type Story = StoryObj<typeof ResetPassword>;

export const Default: Story = {
  args: {},
};
