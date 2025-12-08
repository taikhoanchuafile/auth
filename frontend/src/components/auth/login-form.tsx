import { cn } from "@/lib/utils";
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
import { loginSchema, type LoginValidate } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const { handleSubmit, reset, control } = useForm<LoginValidate>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValidate) => {
    const { isSuccess } = await login(data);
    if (isSuccess) {
      reset();
      navigate("/");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
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
                          {fieldState.error.message}
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
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <a
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
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

              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <a href="/auth/register">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
