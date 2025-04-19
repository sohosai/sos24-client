import { Meta, StoryObj } from "@storybook/react";
import { RegistrationProgress } from "./RegistrationProgress";

const meta: Meta<typeof RegistrationProgress> = {
  component: RegistrationProgress,
};

export default meta;

type Story = StoryObj<typeof RegistrationProgress>;

export const Default: Story = {
  args: {
    step: 1,
  },
};

export const Step1: Story = {
  args: {
    step: 1,
  },
};

export const Step2: Story = {
  args: {
    step: 2,
  },
};

export const Step3: Story = {
  args: {
    step: 3,
  },
};

export const Step4: Story = {
  args: {
    step: 4,
  },
};
