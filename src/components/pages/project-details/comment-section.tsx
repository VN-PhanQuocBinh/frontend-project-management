import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MessageSquareText } from "lucide-react";
import type { Member } from "./detail-modal";

interface CommentSectionProps {
  className?: string;
}

interface Comment {
  id: string;
  user: Member;
  content: string;
  timestamp: string;
}

const mockComments: Comment[] = [
  {
    id: "1",
    user: { id: "1", name: "Alice", initials: "AL", isAdded: true },
    content: "This is the first comment.",
    timestamp: "2024-10-01 10:00 AM",
  },
  {
    id: "2",
    user: { id: "2", name: "Bob", initials: "BO", isAdded: true },
    content: "This is the second comment.",
    timestamp: "2024-10-01 10:05 AM",
  },
  {
    id: "3",
    user: { id: "3", name: "Charlie", initials: "CH", isAdded: true },
    content: "This is the third comment.",
    timestamp: "2024-10-01 10:10 AM",
  },
  {
    id: "4",
    user: { id: "4", name: "Diana", initials: "DI", isAdded: true },
    content: "This is the fourth comment.",
    timestamp: "2024-10-01 10:15 AM",
  },
  {
    id: "5",
    user: { id: "5", name: "Ethan", initials: "ET", isAdded: true },
    content: "This is the fifth comment.",
    timestamp: "2024-10-01 10:20 AM",
  },
  {
    id: "6",
    user: { id: "6", name: "Fiona", initials: "FI", isAdded: true },
    content: "This is the sixth comment.",
    timestamp: "2024-10-01 10:25 AM",
  },
  {
    id: "7",
    user: { id: "7", name: "George", initials: "GE", isAdded: true },
    content: "This is the seventh comment.",
    timestamp: "2024-10-01 10:30 AM",
  },
  {
    id: "8",
    user: { id: "8", name: "Hannah", initials: "HA", isAdded: true },
    content: "This is the eighth comment.",
    timestamp: "2024-10-01 10:35 AM",
  },
];

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

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div key={comment.id} className="mb-4 flex">
      <div>
        <Avatar className="size-8">
          <AvatarImage src={comment.user.avatar} className="" />
          <AvatarFallback
            className={cn(avatarColors[mockComments.indexOf(comment) % avatarColors.length].bg)}
          >
            <span
              className={cn(avatarColors[mockComments.indexOf(comment) % avatarColors.length].text)}
            >
              {comment.user.initials}
            </span>
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="ml-3 space-y-1 w-full">
        <div>
          <span className="font-medium">{comment.user.name}</span>
          <span className="ml-2 text-xs text-gray-500">{comment.timestamp}</span>
        </div>

        <div className="rounded-sm bg-white shadow px-3 py-2 w-full">
          <p className=" text-sm">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}

function CommentSection({ className }: CommentSectionProps) {
  return (
    <div className={cn("flex-1 bg-neutral-50 flex flex-col p-6 overflow-y-auto", className)}>
      <h3 className="text-lg font-semibold mb-4">
        <MessageSquareText className="inline-block mr-2 mb-1 h-5 w-5 text-gray-600" />
        <span>Nhận xét và hoạt động</span>
      </h3>
      <div className="space-y-4">
        <Textarea placeholder="Viết bình luận..." className="min-h-[80px] max-h-36 bg-white border border-gray-300" />
        <Button className="">Gửi</Button>
      </div>
      <div className="mt-6 overflow-y-auto custom-scrollbar pr-3">
        {mockComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
