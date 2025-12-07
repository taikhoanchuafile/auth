import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterValidate } from "@/schemas/authSchema";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const { handleSubmit, control, reset } = useForm<RegisterValidate>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterValidate) => {
    const { name, email, password } = data;
    const { isSuccess } = await register({ name, email, password });
    if (isSuccess) {
      reset();
      navigate("/auth/login");
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      id="name"
                      type="text"
                      placeholder="John Doe"
                    />
                    {fieldState.error && (
                      <FieldDescription className="text-red-500">
                        {fieldState.error?.message}
                      </FieldDescription>
                    )}
                  </Field>
                );
              }}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                    />
                    {fieldState.error && (
                      <FieldDescription className="text-red-500">
                        {fieldState.error?.message}
                      </FieldDescription>
                    )}
                  </Field>
                );
              }}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      id="password"
                      type="password"
                    />
                    {fieldState.error && (
                      <FieldDescription className="text-red-500">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                );
              }}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      id="confirm-password"
                      type="password"
                    />
                    {fieldState.error && (
                      <FieldDescription className="text-red-500">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                );
              }}
            />

            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/auth/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
