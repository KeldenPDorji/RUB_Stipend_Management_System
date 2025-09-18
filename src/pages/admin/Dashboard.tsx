import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, FileText, DollarSign, Settings, LogOut, Bell, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard: React.FC = () => {
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
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-lg font-semibold text-foreground">RUB Stipend Portal</h1>
                  <p className="text-sm text-muted-foreground">Admin Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground">SSO Administrator</p>
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
            Admin Overview
          </h2>
          <p className="text-muted-foreground">
            Monitor and manage student stipend applications across RUB.
          </p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+23 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">Require review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month Disbursed</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Nu. 2.1M</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Applications requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-card-border rounded-lg">
                <div>
                  <h4 className="font-medium">Tenzin Norbu (ST2024001)</h4>
                  <p className="text-sm text-muted-foreground">Monthly Stipend - February 2024</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-card-border rounded-lg">
                <div>
                  <h4 className="font-medium">Karma Lhamo (ST2024002)</h4>
                  <p className="text-sm text-muted-foreground">Emergency Stipend Request</p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border border-card-border rounded-lg">
                <div>
                  <h4 className="font-medium">Pema Wangchuk (ST2024003)</h4>
                  <p className="text-sm text-muted-foreground">Monthly Stipend - February 2024</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Administrative Actions</CardTitle>
              <CardDescription>System management and reporting tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-3" />
                Review Pending Applications
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-3" />
                Manage Student Accounts
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="h-4 w-4 mr-3" />
                Generate Payment Reports
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-3" />
                View Analytics Dashboard
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-3" />
                System Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;