import { Meta, StoryObj } from "@storybook/react";
import { Form } from "./Form";
import { testForm } from "@/helpers/forms";

const meta: Meta = {
  component: Form,
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
  args: {
    form: testForm,
  },
};

export const Editable: Story = {
  args: {
    form: testForm,
    editable: true,
  },
};

export const NotEditable: Story = {
  args: {
    form: testForm,
    editable: false,
  },
};
