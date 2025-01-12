"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Card,
  CardBody,
  Avatar,
  Switch,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";
import Link from "next/link";

interface Room {
  id: string;
  timeControl: number; // minutes
  increment: number; // seconds
  isPrivate: boolean;
  creator: {
    name: string;
    elo: number;
  };
}

// Mock data for rooms
const mockRooms: Room[] = [
  {
    id: "1",
    timeControl: 5,
    increment: 2,
    isPrivate: false,
    creator: {
      name: "Magnus Carlsen",
      elo: 2847,
    },
  },
  {
    id: "2",
    timeControl: 3,
    increment: 1,
    isPrivate: false,
    creator: {
      name: "Hikaru Nakamura",
      elo: 2768,
    },
  },
  {
    id: "3",
    timeControl: 10,
    increment: 5,
    isPrivate: true,
    creator: {
      name: "Ding Liren",
      elo: 2780,
    },
  },
];

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timeControl, setTimeControl] = useState(5);
  const [increment, setIncrement] = useState(2);
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreateRoom = () => {
    // Handle room creation logic here
    onClose();
  };

  const handleLogout = () => {
    // Handle logout logic here
  };

  const handleSettings = () => {
    // Handle settings logic here
  };

  return (
    <div className='min-h-screen bg-content1 p-8'>
      {/* Header with Logo */}
      <div className='flex justify-between items-center mb-8'>
        <div className='flex items-center'>
          <h1 className='text-3xl font-bold'>Chess Online</h1>
        </div>
        <div className='flex items-center gap-4'>
          <Button color='primary' onPress={onOpen} size='md'>
            Create Room
          </Button>
          <Dropdown placement='bottom-end'>
            <DropdownTrigger>
              <User
                as='button'
                name='John Doe'
                description='2000 ELO'
                avatarProps={{
                  src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                  size: "sm",
                }}
                className='transition-transform cursor-pointer'
              />
            </DropdownTrigger>
            <DropdownMenu aria-label='User Actions'>
              <DropdownItem key='settings' onPress={handleSettings}>
                <Link href='/settings'>Settings</Link>
              </DropdownItem>
              <DropdownItem key='logout' className='text-danger' color='danger' onPress={handleLogout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Create Room Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Create New Room</ModalHeader>
          <ModalBody>
            <div className='space-y-4'>
              <Input
                type='number'
                label='Time Control (minutes)'
                value={timeControl.toString()}
                onChange={(e) => setTimeControl(Number(e.target.value))}
                min={1}
              />
              <Input
                type='number'
                label='Increment (seconds)'
                value={increment.toString()}
                onChange={(e) => setIncrement(Number(e.target.value))}
                min={0}
              />
              <div className='flex justify-between items-center'>
                <span>Private Room</span>
                <Switch checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={onClose}>
              Cancel
            </Button>
            <Button color='primary' onPress={handleCreateRoom}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Room List */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {mockRooms.map((room) => (
          <Card key={room.id}>
            <CardBody>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='text-lg font-semibold'>Room #{room.id}</h3>
                  <p className='text-default-500'>
                    Time Control: {room.timeControl}+{room.increment}
                  </p>
                  {room.isPrivate && <span className='text-warning'>Private Room</span>}
                </div>
                <div className='text-right'>
                  <div className='flex items-center gap-2'>
                    <Avatar name={room.creator.name} size='sm' />
                    <div>
                      <p className='font-medium'>{room.creator.name}</p>
                      <p className='text-default-500'>ELO: {room.creator.elo}</p>
                    </div>
                  </div>
                  <Button color='primary' className='mt-2' size='sm' fullWidth>
                    Join Room
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
