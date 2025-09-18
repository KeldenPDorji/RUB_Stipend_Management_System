import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, FileText, DollarSign, Settings, LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-background">
      {/* Header */}
      <header className="bg-card border-b border-card-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-lg font-semibold text-foreground">RUB Stipend Portal</h1>
                  <p className="text-sm text-muted-foreground">Student Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground">{user?.studentId}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-muted-foreground">
            Manage your stipend applications and track your status here.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">1 pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Received</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Nu. 12,500</div>
              <p className="text-xs text-muted-foreground">This academic year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
              <Badge variant="secondary">Approved</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Nu. 2,500</div>
              <p className="text-xs text-muted-foreground">Expected Feb 15</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest stipend application submissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-card-border rounded-lg">
                <div>
                  <h4 className="font-medium">Monthly Stipend - January 2024</h4>
                  <p className="text-sm text-muted-foreground">Submitted on Jan 5, 2024</p>
                </div>
                <Badge variant="default">Approved</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-card-border rounded-lg">
                <div>
                  <h4 className="font-medium">Monthly Stipend - February 2024</h4>
                  <p className="text-sm text-muted-foreground">Submitted on Feb 1, 2024</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-3" />
                Submit New Application
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="h-4 w-4 mr-3" />
                View Payment History
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-3" />
                Account Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;