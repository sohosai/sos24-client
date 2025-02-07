import { Meta, StoryObj } from "@storybook/react";

import { FileView } from "./FileView";
import { fn } from "@storybook/test";

const meta: Meta = {
  component: FileView,
};

export default meta;

type Story = StoryObj<typeof FileView>;

export const Default: Story = {
  args: {
    delete: fn(),
  },
};

export const Error: Story = {
  args: {
    error: true,
  },
};

export const File: Story = {
  args: {
    name: "企画.pdf",
    delete: fn(),
  },
};

export const Image: Story = {
  args: {
    name: "企画.png",
    delete: fn(),
  },
};
