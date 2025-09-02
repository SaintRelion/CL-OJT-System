import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

const RegistrationPage = () => {
  const [role, setRole] = useState<string>("student");

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Role Selector */}
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="departmentadmin">
                  Department Admin
                </SelectItem>
                <SelectItem value="adviser">Adviser</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Shared Fields */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Full Name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Email Address" />
          </div>

          {/* Role-specific fields */}
          {role === "student" && (
            <>
              <div className="space-y-2">
                <Label>Course</Label>
                <Input placeholder="BS Computer Science" />
              </div>

              <div className="space-y-2">
                <Label>School Year</Label>
                <Input placeholder="2024-2025" />
              </div>

              <div className="space-y-2">
                <Label>Training Hours Required</Label>
                <Input type="number" placeholder="300" />
              </div>

              <div className="space-y-2">
                <Label>Company Assignment</Label>
                <Input placeholder="Accenture, Globe, etc." />
              </div>
            </>
          )}

          {role === "adviser" && (
            <div className="space-y-2">
              <Label>Department</Label>
              <Input placeholder="e.g., Computer Science" />
            </div>
          )}

          {(role === "superadmin" || role === "departmentadmin") && (
            <div className="space-y-2">
              <Label>System Credentials / Department Code</Label>
              <Input placeholder="Enter system key" />
            </div>
          )}

          <Button className="w-full">Register</Button>

          {/* 🚀 New section */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
export default RegistrationPage;
