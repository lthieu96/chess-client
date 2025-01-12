"use client";

import { Card, Input, Button, CardBody, CardHeader } from "@nextui-org/react";
import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // TODO: Implement register logic
    console.log("Register attempt with:", { username, email, password });
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-white p-4'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='flex flex-col gap-3 text-center'>
          <h1 className='text-2xl font-bold'>Create Account</h1>
          <p className='text-sm text-gray-500'>Please fill in your details to register</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleRegister} className='flex flex-col gap-4'>
            <Input
              type='text'
              label='Username'
              placeholder='Choose a username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type='email'
              label='Email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type='password'
              label='Password'
              placeholder='Create a password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type='password'
              label='Confirm Password'
              placeholder='Confirm your password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type='submit' color='primary' className='mt-2'>
              Create Account
            </Button>
            <Button type='submit' color='default' variant='bordered' className='mt-2'>
              Sign up with Google
            </Button>
            <div className='text-center text-sm text-gray-500'>
              Already have an account?{" "}
              <Link href='/' className='text-blue-500 hover:underline'>
                Sign In
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
