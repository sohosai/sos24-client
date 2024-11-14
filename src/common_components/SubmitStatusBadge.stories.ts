import { Meta, StoryObj } from "@storybook/react";
import { SubmitStatusBadge } from "./SubmitStatusBadge";

const meta: Meta<typeof SubmitStatusBadge> = {
  component: SubmitStatusBadge,
};

export default meta;

type Story = StoryObj<typeof SubmitStatusBadge>;

export const Default: Story = {
  args: {
    status: "未提出",
  },
};

export const Submitted: Story = {
  args: {
    status: "提出済み",
  },
};

export const Delayed: Story = {
  args: {
    status: "遅延提出",
  },
};
