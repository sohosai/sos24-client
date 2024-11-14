import { Meta, StoryObj } from "@storybook/react";

import { FormStatusBadge } from "./FormStatusBadge";

const meta: Meta<typeof FormStatusBadge> = {
  component: FormStatusBadge,
};

export default meta;

type Story = StoryObj<typeof FormStatusBadge>;

export const Default: Story = {
  args: {
    status: "開始前",
  },
};

export const 受付中: Story = {
  args: {
    status: "受付中",
  },
};

export const 受付終了: Story = {
  args: {
    status: "受付終了",
  },
};
