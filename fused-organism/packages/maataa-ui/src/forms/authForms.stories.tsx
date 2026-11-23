import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  SignInForm,
  SignUpForm,
  PasswordResetRequestForm,
  PasswordResetConfirmForm,
} from "./authForms";
import { ProviderSignInButtons } from "../actions/ProviderSignInButtons";

const meta = {
  title: "Forms/SignInForm",
  component: SignInForm,
  tags: ["autodocs"],
} satisfies Meta<typeof SignInForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: () => {},
    onForgotPassword: () => {},
    onCreateAccount: () => {},
    children: (
      <ProviderSignInButtons providers={[{ id: "google", name: "Google" }]} onSelect={() => {}} />
    ),
  },
};
export const SignUp: Story = {
  args: Default.args,
  render: () => (
    <SignUpForm onSubmit={() => {}} termsHref="#" privacyHref="#" onSignIn={() => {}} />
  ),
};
export const ResetRequest: Story = {
  args: Default.args,
  render: () => <PasswordResetRequestForm onSubmit={() => {}} onBack={() => {}} />,
};
export const ResetSent: Story = {
  args: Default.args,
  render: () => <PasswordResetRequestForm onSubmit={() => {}} sent />,
};
export const ResetConfirm: Story = {
  args: Default.args,
  render: () => <PasswordResetConfirmForm onSubmit={() => {}} />,
};
export const ResetExpired: Story = {
  args: Default.args,
  render: () => (
    <PasswordResetConfirmForm onSubmit={() => {}} expired onRequestNewLink={() => {}} />
  ),
};
