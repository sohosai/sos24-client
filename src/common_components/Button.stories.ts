import { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

const meta: Meta = {
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Purple: Story = {
  args: {
    color: "purple",
    children: "ボタン",
  },
};

export const Secondary: Story = {
  args: {
    color: "secondary",
    children: "ボタン",
  },
};

export const Blue: Story = {
  args: {
    color: "blue",
    children: "ボタン",
  },
};

export const Big: Story = {
  args: {
    size: "big",
    children: "ボタン",
  },
};
