import { Meta, StoryObj } from "@storybook/react";

import { File as FileComponent } from "./File";

const meta: Meta = {
  component: FileComponent,
};

export default meta;

type Story = StoryObj<typeof FileComponent>;

export const Default: Story = {
  args: {
    file: new File([], "file.txt"),
  },
};

export const WithError: Story = {
  args: {
    file: new File([], "file.txt"),
    error: true,
  },
};
