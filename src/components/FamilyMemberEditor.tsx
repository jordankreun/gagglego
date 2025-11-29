import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Member {
  id: string;
  name: string;
  type: "adult" | "kid";
  age?: number;
  napTime?: string;
}

interface FamilyMemberEditorProps {
  members: Member[];
  onChange: (members: Member[]) => void;
}

export const FamilyMemberEditor = ({ members, onChange }: FamilyMemberEditorProps) => {
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberType, setNewMemberType] = useState<"adult" | "kid">("adult");

  const addMember = () => {
    if (!newMemberName.trim()) return;

    const newMember: Member = {
      id: Date.now().toString(),
      name: newMemberName,
      type: newMemberType,
      ...(newMemberType === "kid" && { age: 3, napTime: "1:00 PM" }),
    };

    onChange([...members, newMember]);
    setNewMemberName("");
    setNewMemberType("adult");
  };

  const removeMember = (id: string) => {
    onChange(members.filter(m => m.id !== id));
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    onChange(members.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const convertTimeToInput = (timeStr?: string): string => {
    if (!timeStr) return "13:00";
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return "13:00";
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const convertInputToTime = (timeInput: string): string => {
    const [hours, minutes] = timeInput.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Existing Members */}
      <div className="space-y-2">
        {members.map((member) => (
          <div key={member.id} className="p-2.5 sm:p-3 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                <Badge variant={member.type === "adult" ? "secondary" : "default"} className="text-xs flex-shrink-0">
                  {member.type === "adult" ? "👤" : "🧒"}
                </Badge>
                <Input
                  value={member.name}
                  onChange={(e) => updateMember(member.id, { name: e.target.value })}
                  className="h-8 sm:h-9 flex-1 text-sm"
                  placeholder="Name"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                onClick={() => removeMember(member.id)}
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </div>

            {member.type === "kid" && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-xs">Age</Label>
                  <Input
                    type="number"
                    min="0"
                    max="18"
                    value={member.age || ""}
                    onChange={(e) => updateMember(member.id, { age: parseInt(e.target.value) || undefined })}
                    className="h-8 sm:h-9 text-sm"
                    placeholder="Age"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Nap Time</Label>
                  <Input
                    type="time"
                    value={convertTimeToInput(member.napTime)}
                    onChange={(e) => updateMember(member.id, { napTime: convertInputToTime(e.target.value) })}
                    className="h-8 sm:h-9 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Member */}
      <div className="p-2.5 sm:p-3 border-2 border-dashed rounded-lg space-y-2">
        <Label className="text-xs sm:text-sm font-semibold">Add Member</Label>
        <div className="flex gap-2">
          <Select value={newMemberType} onValueChange={(v: "adult" | "kid") => setNewMemberType(v)}>
            <SelectTrigger className="w-20 sm:w-24 h-9 sm:h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adult">Adult</SelectItem>
              <SelectItem value="kid">Kid</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Name"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMember())}
            className="flex-1 h-9 sm:h-10 text-sm"
          />
          <Button type="button" onClick={addMember} size="icon" className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
