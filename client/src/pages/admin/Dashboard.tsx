import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, MessageSquare, BookOpen } from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">🎓 Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage materials, users, and student questions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <FileText className="text-primary" />
            <div>
              <p className="text-xl font-bold">128</p>
              <p className="text-sm text-muted-foreground">Total Materials</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Users className="text-primary" />
            <div>
              <p className="text-xl font-bold">472</p>
              <p className="text-sm text-muted-foreground">Registered Students</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <MessageSquare className="text-primary" />
            <div>
              <p className="text-xl font-bold">36</p>
              <p className="text-sm text-muted-foreground">Unanswered Questions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <BookOpen className="text-primary" />
            <div>
              <p className="text-xl font-bold">18</p>
              <p className="text-sm text-muted-foreground">Active Subjects</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-lg">Manage Materials</h3>
            <p className="text-sm text-muted-foreground">
              Upload or edit syllabus, notes, and lectures.
            </p>
            <Button variant="outline" className="w-full">
              Go to Materials
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-lg">Manage Users</h3>
            <p className="text-sm text-muted-foreground">
              View student registrations and manage roles.
            </p>
            <Button variant="outline" className="w-full">
              Go to Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-lg">Answer Questions</h3>
            <p className="text-sm text-muted-foreground">
              View and respond to student-submitted doubts.
            </p>
            <Button variant="outline" className="w-full">
              Go to Questions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
