import { Meta, StoryObj } from "@storybook/react";

import { NotFound } from "./NotFound";

const meta: Meta<typeof NotFound> = {
  component: NotFound,
};

export default meta;

type Story = StoryObj<typeof NotFound>;

export const Default: Story = {
  args: {},
};

export const WithMessage: Story = {
  args: {
    message: "お知らせが見つかりませんでした",
  },
};
