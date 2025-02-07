import { Meta, StoryObj } from "@storybook/react";

import { RequiredBadge } from "./RequiredBadge";

const meta: Meta = {
  component: RequiredBadge,
};

export default meta;

type Story = StoryObj<typeof RequiredBadge>;

export const Required: Story = {
  args: {
    isRequired: true,
  },
};

export const Optional: Story = {
  args: {
    isRequired: false,
  },
};
