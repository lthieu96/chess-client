import { cn, Spinner } from "@nextui-org/react";

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function FullPageLoading({ className, ...props }: Props) {
  return (
    <div className={cn("flex items-center justify-center h-screen", className)} {...props}>
      <Spinner size='lg' />
    </div>
  );
}
