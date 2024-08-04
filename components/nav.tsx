import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideLogOut } from "lucide-react";
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Nav() {
  const { data: session } = useSession();

  const Pfp = ({ session }: { session: Session }) => (
    <Avatar>
      <AvatarImage src={session.user!.image!} />
      <AvatarFallback className="bg-spotify-black text-white">
        {session.user?.name?.at(0)}
      </AvatarFallback>
    </Avatar>
  );

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="relative w-full flex justify-between items-center py-2 sm:py-8 px-4 sm:px-32">
      <Link className="sm:text-2xl font-bold" href="/">
        byebye.
      </Link>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-row items-center space-x-4">
            <p className="font-medium text-spotify-black invisible sm:visible sm:text-lg underline">
              {session.user?.name}
            </p>
            <Pfp session={session} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[150px] sm:w-[200px]">
            <DropdownMenuLabel className="visible sm:hidden">
              <p className="">{session.user?.name}</p>
            </DropdownMenuLabel>
            <DropdownMenuItem className="space-x-2" onClick={handleSignOut}>
              <LucideLogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <p className="text-xs sm:text-base">Sign Out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
