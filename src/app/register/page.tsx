"use client";

import { Card, Input, Button, CardBody, CardHeader, Form } from "@nextui-org/react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/AuthProvider";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FullPageLoading from "../_components/fullpage-loading";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot exceed 20 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, googleLoginMutation, isAuthenticated, isLoading } = useAuth();
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      googleLoginMutation.mutate(
        {
          token: tokenResponse.access_token,
        },
        {
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    },
  });
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });
    } catch (error: unknown) {
      setError("root", {
        type: "server",
        message: error instanceof Error ? error.message : "An error occurred during registration",
      });
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router, isLoading]);

  if (isLoading) {
    return <FullPageLoading />;
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-white p-4'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='flex flex-col gap-3 text-center'>
          <h1 className='text-2xl font-bold'>Create Account</h1>
          <p className='text-sm text-gray-500'>Please fill in your details to register</p>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <Input
              {...register("username")}
              type='text'
              label='Username'
              placeholder='Choose a username'
              isInvalid={!!errors.username}
              errorMessage={errors.username?.message}
            />
            <Input
              {...register("email")}
              type='email'
              label='Email'
              placeholder='Enter your email'
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <Input
              {...register("password")}
              type='password'
              label='Password'
              placeholder='Choose a password'
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            <Input
              {...register("confirmPassword")}
              type='password'
              label='Confirm Password'
              placeholder='Confirm your password'
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
            />
            {errors.root && <div className='pl-2 text-sm text-red-500 rounded-medium'>{errors.root.message}</div>}
            <Button type='submit' color='primary' className='mt-2 w-full' isLoading={isSubmitting}>
              Create Account
            </Button>
            <Button
              type='button'
              color='default'
              variant='bordered'
              className='mt-2 w-full'
              onPress={() => googleLogin()}
              isLoading={googleLoginMutation.isPending}
            >
              Sign In with Google
            </Button>
            <div className='text-center text-sm text-gray-500 w-full'>
              Already have an account?{" "}
              <Link href='/login' className='text-blue-500 hover:underline'>
                Sign In
              </Link>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
