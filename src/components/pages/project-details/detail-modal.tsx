import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, MoreHorizontal, Star, X } from "lucide-react";
import CommentSection from "./comment-section";
import DescriptionSection from "./description-section";
import DeadlinePicker from "./deadline-picker";
import MembersSection from "./members-section";

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  isAdded: boolean;
}

interface DetailModalProps {
  cardId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailModal({ open, cardId, onOpenChange }: DetailModalProps) {
  const [title, setTitle] = useState("Conn Cak");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [deadline, setDeadline] = useState<Date>();
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "Bình Thái", initials: "BT", isAdded: true },
    { id: "2", name: "Quốc Huy", initials: "QH", isAdded: true },
    { id: "3", name: "Phan Quốc Bình", initials: "PB", isAdded: true },
    { id: "4", name: "Nguyễn Bảo", initials: "NB", isAdded: true },
    { id: "5", name: "Quốc An", initials: "QA", isAdded: false },
    { id: "6", name: "Minh Tuấn", initials: "MT", isAdded: false },
  ]);

  const addedMembers = members.filter((m) => m.isAdded);
  const availableMembers = members.filter((m) => !m.isAdded);

  useEffect(() => {
    if (cardId) {
      // Fetch card details using cardId
      // For demonstration, we'll just set some mock data
    }
  }, [cardId]);

  const toggleMember = (memberId: string) => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, isAdded: !m.isAdded } : m)));
  };

  const handleSaveDescription = (desc: string) => {
    alert("Save description: " + desc);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col overflow-hidden gap-0 max-w-[90vw] min-w-[60vw] max-h-[90vh] p-0"
      >
        <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-300 p-3">
          <div className="">
            <div className="px-3 py-1 rounded-sm bg-gray-200 font-semibold">Not started</div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="flex flex-row flex-1 overflow-hidden">
          {/* Left Side */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200">
            <DialogHeader>
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  className="text-2xl font-semibold"
                  autoFocus
                />
              ) : (
                <DialogTitle
                  className="text-2xl cursor-pointer hover:bg-muted/50 p-2 rounded"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {title}
                </DialogTitle>
              )}
            </DialogHeader>

            <div className="mt-4 space-y-6">
              {/* Members Section */}
              <MembersSection
                className=""
                addedMembers={addedMembers}
                availableMembers={availableMembers}
                toggleMember={toggleMember}
              />

              {/* Deadline */}
              <DeadlinePicker className="" deadline={deadline} onDeadlineSave={setDeadline} />

              {/* Description */}
              <DescriptionSection className="" onSave={handleSaveDescription} />
            </div>
          </div>

          {/* Right Side - Activity */}
          <CommentSection className="" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
