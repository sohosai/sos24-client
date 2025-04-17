import { Meta, StoryObj } from "@storybook/react";

import { NoResultNotice } from "./NoResultNotice";

const meta: Meta<typeof NoResultNotice> = {
  component: NoResultNotice,
};

export default meta;

type Story = StoryObj<typeof NoResultNotice>;

export const Default: Story = {
  args: {
    message: "検索結果がありません",
  },
};
