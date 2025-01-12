"use client";

import { Card, Input, Button, CardBody, CardHeader, Form } from "@nextui-org/react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/providers/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FullPageLoading from "../_components/fullpage-loading";

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, googleLoginMutation, isAuthenticated, isLoading } = useAuth();
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      console.log(userInfo);
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
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data);
    } catch (error: unknown) {
      setError("root", {
        type: "server",
        message: error instanceof Error ? error.message : "An error occurred during login",
      });
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router, isLoading]);

  if (isLoading) {
    return <FullPageLoading />;
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-white p-4'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='flex flex-col gap-3 text-center'>
          <h1 className='text-2xl font-bold'>Welcome Back</h1>
          <p className='text-sm text-gray-500'>Please sign in to continue</p>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <Input
              {...register("emailOrUsername")}
              type='text'
              label='Email or Username'
              placeholder='Enter your email or username'
              isInvalid={!!errors.emailOrUsername}
              errorMessage={errors.emailOrUsername?.message}
            />
            <Input
              {...register("password")}
              type='password'
              label='Password'
              placeholder='Enter your password'
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            {errors.root && <div className='pl-2 text-sm text-red-500 rounded-medium'>{errors.root.message}</div>}
            <Button type='submit' color='primary' className='mt-2 w-full' isLoading={isSubmitting}>
              Sign In
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
              {"Don't have an account? "}
              <Link href='/register' className='text-blue-500 hover:underline'>
                Sign Up
              </Link>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
