"use client";

import { useEffect, useState } from "react";
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
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import FullPageLoading from "./_components/fullpage-loading";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-client";
import { PublishedGame } from "@/types/game";
import toast from "react-hot-toast";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timeControl, setTimeControl] = useState(5);
  const [increment, setIncrement] = useState(2);
  const [isPrivate, setIsPrivate] = useState(false);
  const { logout, user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const { data: rooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => axiosInstance.get<PublishedGame[]>("/games").then((res) => res.data),
  });

  const { mutate: createRoom, isPending: isCreatingRoom } = useMutation({
    mutationFn: () =>
      axiosInstance.post("/games", { timeControl: timeControl * 60, increment, isPrivate }).then((res) => res.data),
    onSuccess: (data) => {
      onClose();
      router.push(`/game/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, isLoading]);

  if (isLoading) {
    return <FullPageLoading />;
  }

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
                name={user?.username}
                description={`${user?.rating} ELO`}
                avatarProps={{
                  src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                  size: "sm",
                }}
                className='transition-transform cursor-pointer'
              />
            </DropdownTrigger>
            <DropdownMenu aria-label='User Actions'>
              <DropdownItem key='settings' onPress={() => router.push("/settings")}>
                <Link href='/settings'>Settings</Link>
              </DropdownItem>
              <DropdownItem key='logout' className='text-danger' color='danger' onPress={() => logout()}>
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
            <Button color='primary' onPress={() => createRoom()} isLoading={isCreatingRoom}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Room List */}
      {isLoadingRooms && <FullPageLoading className='w-full h-full' />}
      {!isLoadingRooms && rooms?.length === 0 && <p>No rooms available</p>}
      {!isLoadingRooms && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {rooms?.map((room) => (
            <Card key={room.id}>
              <CardBody>
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='text-lg font-semibold'>Room #{room.id}</h3>
                    <p className='text-default-500'>
                      Time Control: {room.timeControl / 60}+{room.increment}
                    </p>
                    {room.isPrivate && <span className='text-warning'>Private Room</span>}
                  </div>
                  <div className='text-right'>
                    <div className='flex items-center gap-2'>
                      <Avatar name={room.creator.username} size='sm' />
                      <div>
                        <p className='font-medium'>{room.creator.username}</p>
                        <p className='text-default-500'>ELO: {room.creator.rating}</p>
                      </div>
                    </div>
                    <Link href={`/game/${room.id}`}>
                      <Button color='primary' className='mt-2' size='sm' fullWidth>
                        Join Room
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
