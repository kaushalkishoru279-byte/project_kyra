"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";

export function FamilyMemberForm() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
         <UserPlus className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Add Family Member</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="e.g., Jane Doe" />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="caregiver">Caregiver</SelectItem>
              <SelectItem value="member">Family Member</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="e.g., jane.doe@example.com" />
        </div>
        <Button className="w-full mt-2">
          Add Member
        </Button>
      </CardContent>
    </Card>
  );
}
