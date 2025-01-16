"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Select,
  SelectItem,
  Switch,
  Divider,
  Tab,
  Tabs,
  Form,
} from "@nextui-org/react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUsername, changePassword } from "@/services/user.service";
import { usernameSchema } from "@/schemas/user.schema";
import { changePasswordSchema, type ChangePasswordInput } from "@/schemas/password.schema";
import { toast } from "react-hot-toast";
import { useAuth } from "@/providers/AuthProvider";

const boardThemes = [
  { label: "Classic", value: "classic" },
  { label: "Wood", value: "wood" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Dark", value: "dark" },
];

export default function Settings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register: registerUsername,
    handleSubmit: handleUsernameSubmit,
    formState: { errors: usernameErrors, isSubmitting: isUsernameSubmitting },
  } = useForm({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const updateUsernameMutation = useMutation({
    mutationFn: ({ username }: { username: string }) => updateUsername(user?.id as string, username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Username updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update username");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordInput) => changePassword(user?.id as string, data),
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update password");
    },
  });

  const onUsernameSubmit = (data: { username: string }) => {
    updateUsernameMutation.mutate(data);
  };

  const onPasswordSubmit = (data: ChangePasswordInput) => {
    changePasswordMutation.mutate(data);
  };

  // Board settings
  const [selectedTheme, setSelectedTheme] = useState("classic");
  const [showCoordinates, setShowCoordinates] = useState(true);

  const handleUpdateBoardSettings = () => {
    // Handle board settings update logic
    console.log("Updating board settings...");
  };

  return (
    <div className='min-h-screen bg-content1 p-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Settings</h1>
        <Link href='/'>
          <Button color='default' size='sm'>
            <ChevronLeft />
          </Button>
        </Link>
      </div>

      <Tabs aria-label='Settings tabs'>
        <Tab key='profile' title='Profile Settings'>
          <Card className='max-w-xl'>
            <CardHeader className='flex justify-between'>
              <h2 className='text-xl font-semibold'>Profile Settings</h2>
            </CardHeader>
            <CardBody className='space-y-6'>
              <div>
                <Form onSubmit={handleUsernameSubmit(onUsernameSubmit)} className='flex flex-col gap-4'>
                  <Input
                    {...registerUsername("username")}
                    label='Username'
                    placeholder='Enter new username'
                    isInvalid={!!usernameErrors.username}
                    errorMessage={usernameErrors.username?.message}
                  />
                  <Button
                    color='primary'
                    type='submit'
                    isLoading={isUsernameSubmitting || updateUsernameMutation.isPending}
                  >
                    Update Username
                  </Button>
                </Form>
              </div>

              <Divider />

              <div>
                <Form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className='flex flex-col gap-4'>
                  <Input
                    {...registerPassword("oldPassword")}
                    type='password'
                    label='Current Password (Optional)'
                    placeholder='Enter current password'
                    isInvalid={!!passwordErrors.oldPassword}
                    errorMessage={passwordErrors.oldPassword?.message}
                  />
                  <Input
                    {...registerPassword("newPassword")}
                    type='password'
                    label='New Password'
                    placeholder='Enter new password'
                    isInvalid={!!passwordErrors.newPassword}
                    errorMessage={passwordErrors.newPassword?.message}
                  />
                  <Button
                    color='primary'
                    type='submit'
                    isLoading={isPasswordSubmitting || changePasswordMutation.isPending}
                  >
                    Update Password
                  </Button>
                </Form>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key='board' title='Board Settings'>
          <Card className='max-w-xl'>
            <CardHeader>
              <h2 className='text-xl font-semibold'>Board Settings</h2>
            </CardHeader>
            <CardBody className='space-y-6'>
              <div>
                <Select
                  label='Board Theme'
                  placeholder='Select a theme'
                  selectedKeys={[selectedTheme]}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                >
                  {boardThemes.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className='flex justify-between items-center'>
                <span>Show Coordinates</span>
                <Switch checked={showCoordinates} onChange={(e) => setShowCoordinates(e.target.checked)} />
              </div>

              <Button color='primary' onPress={handleUpdateBoardSettings}>
                Save Board Settings
              </Button>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
