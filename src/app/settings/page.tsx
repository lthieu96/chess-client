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
} from "@nextui-org/react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const boardThemes = [
  { label: "Classic", value: "classic" },
  { label: "Wood", value: "wood" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Dark", value: "dark" },
];

export default function Settings() {
  // Profile settings
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Board settings
  const [selectedTheme, setSelectedTheme] = useState("classic");
  const [showCoordinates, setShowCoordinates] = useState(true);

  const handleUpdateProfile = () => {
    // Handle profile update logic
    console.log("Updating profile...");
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      // Show error message
      return;
    }
    // Handle password update logic
    console.log("Updating password...");
  };

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
                <Input
                  label='Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='Enter new username'
                />
                <Button color='primary' className='mt-2' onPress={handleUpdateProfile}>
                  Update Username
                </Button>
              </div>

              <Divider />

              <div className='space-y-4'>
                <Input
                  label='Current Password'
                  type='password'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder='Enter current password'
                />
                <Input
                  label='New Password'
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Enter new password'
                />
                <Input
                  label='Confirm New Password'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm new password'
                />
                <Button color='primary' onPress={handleUpdatePassword}>
                  Update Password
                </Button>
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
