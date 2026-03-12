import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps extends Omit<
  React.ComponentProps<typeof Avatar>,
  "children " | "className" | "size"
> {
  className?: string;
  username: string;
  avatar: string;
  size?: number; // in px
}

function UserAvatar({ username, avatar, size = 32, className, ...props }: UserAvatarProps) {
  const avatarColor = avatarColors[username.charCodeAt(0) % avatarColors.length];

  return (
    <Avatar
      className={cn("", className)}
      {...props}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <AvatarImage src={avatar} className="object-cover" />
      <AvatarFallback className={cn(avatarColor.bg, avatarColor.text)}>
        <span
          className={cn("text-white")}
          style={{
            fontSize: `${size / 2}px`,
          }}
        >
          {username[0].toUpperCase()}
        </span>
      </AvatarFallback>
    </Avatar>
  );
}

const avatarColors = [
  {
    bg: "bg-red-500",
    text: "text-white",
  },
  {
    bg: "bg-green-500",
    text: "text-white",
  },
  {
    bg: "bg-blue-500",
    text: "text-white",
  },
  {
    bg: "bg-yellow-500",
    text: "text-white",
  },
  {
    bg: "bg-purple-500",
    text: "text-white",
  },
  {
    bg: "bg-pink-500",
    text: "text-white",
  },
];

export default UserAvatar;
