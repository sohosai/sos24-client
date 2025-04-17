import { Meta, StoryObj } from "@storybook/react";

import { NotificationBadge } from "./NotificationBadge";

const meta: Meta<typeof NotificationBadge> = {
  component: NotificationBadge,
};

export default meta;

type Story = StoryObj<typeof NotificationBadge>;

export const Default: Story = {
  args: {
    count: 5,
  },
};
