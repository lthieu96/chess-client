"use client";

import { Card, Input, Button, CardBody, CardHeader } from "@nextui-org/react";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login attempt with:", { identifier, password });
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-white p-4'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='flex flex-col gap-3 text-center'>
          <h1 className='text-2xl font-bold'>Welcome Back</h1>
          <p className='text-sm text-gray-500'>Please sign in to continue</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin} className='flex flex-col gap-4'>
            <Input
              type='text'
              label='Email or Username'
              placeholder='Enter your email or username'
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <Input
              type='password'
              label='Password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type='submit' color='primary' className='mt-2'>
              Sign In
            </Button>
            <Button type='submit' color='default' variant='bordered' className='mt-2'>
              Sign In with Google
            </Button>
            <div className='text-center text-sm text-gray-500'>
              {"Don't have an account? "}
              <Link href='/register' className='text-blue-500 hover:underline'>
                Sign Up
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
