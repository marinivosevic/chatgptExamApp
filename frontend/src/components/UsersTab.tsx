"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User } from "@/app/types/user";
import { userService } from "@/app/api/userService";

const UsersTab = ({ courseId }: { courseId: number }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users already in the course
  useEffect(() => {
    userService.useGetUsersInCourse(courseId).then((data: User[]) => {
      setUsers(data);
    });

    // Fetch all students for the dropdown
    userService.useGetAllStudents().then((data: User[]) => {
      setAllStudents(data);
      setFilteredStudents(data); // Initialize filtered list
    });
  }, [courseId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = allStudents.filter((student) =>
      student.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const addUserToCourse = () => {
    if (!selectedStudent) return;
      console.log(selectedStudent,courseId);
    // API call to add student to the course
    userService
      .useAddUsersToCourse(courseId, selectedStudent)
      .then(() => {
        // Update the course users after successful addition
        userService.useGetUsersInCourse(courseId).then((updatedUsers: User[]) => {
          setUsers(updatedUsers);
        });
        setSelectedStudent(null); // Reset selected user
        setShowDropdown(false); // Close dropdown
        setSearchQuery(""); // Clear search input
      })
      .catch((error) => {
        console.error("Failed to add user:", error);
      });
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="shadow-md hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Email: {user.email}
              </p>
              <p className="text-sm text-muted-foreground">Role: {user.role}</p>
              <p className="text-sm text-muted-foreground">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative mt-4">
        {!showDropdown && (
          <Button
            onClick={() => setShowDropdown(true)}
            variant="default"
            className="z-10"
          >
            Add User
          </Button>
        )}

        {showDropdown && (
          <div className="transition-all duration-500 ease-in-out   flex flex-col items-center px-4 py-2 absolute top-0 left-0 right-0 rounded-md">
            <Input
              type="text"
              placeholder="Search for a student"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="mb-2 w-full"
            />
            <div className="max-h-48 overflow-y-auto w-full bg-white shadow rounded">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(Number(student.id))}
                    className={`p-2 cursor-pointer hover:bg-gray-200 ${
                      selectedStudent === Number(student.id) ? "bg-gray-300" : ""
                    }`}
                  >
                    {student.name}
                  </div>
                ))
              ) : (
                <p className="p-2 text-sm text-gray-500">No students found</p>
              )}
            </div>
            <div className="mt-2 w-full flex justify-end">
              <Button onClick={addUserToCourse} variant="default" disabled={!selectedStudent}>
                Submit
              </Button>
              <Button
                onClick={() => {
                  setShowDropdown(false);
                  setSearchQuery("");
                  setSelectedStudent(null);
                }}
                variant="secondary"
                className="ml-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTab;
