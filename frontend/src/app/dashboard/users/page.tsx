"use client";

import React, {  useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { userService } from "@/app/api/userService";
import { User } from "../../types/user"; 
import { useRouter } from "next/navigation";
const UsersPage = () => {
    const router = useRouter();
    const [users, setUsers] = React.useState<User[]>([]);
    useEffect(() => {
        userService.useGetAllUsers().then((data: User[]) => {
            setUsers(data);
        });
    }, []);

  return (
    <div className="p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button variant="default" onClick={() => router.push("/dashboard/users/createUser")}>Add User</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="shadow-md hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Email: {user.email}</p>
              <p className="text-sm text-muted-foreground">Role: {user.role}</p>
              <p className="text-sm text-muted-foreground">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;