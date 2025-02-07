import { Meta, StoryObj } from "@storybook/react";
import { SignUpForm } from "./SignupForm";

const meta: Meta = {
  component: SignUpForm,
};

export default meta;

type Story = StoryObj<typeof SignUpForm>;

export const Default: Story = {
  args: {},
};
