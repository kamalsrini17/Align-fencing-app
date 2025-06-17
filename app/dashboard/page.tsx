'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Activity, 
  Target, 
  Calendar, 
  Dumbbell, 
  TrendingUp,
  User,
  Settings,
  Bell,
  ChevronRight,
  Play,
  CheckCircle,
  Star,
  Timer,
  Zap,
  Heart,
  Brain,
  Moon,
  LogOut
} from 'lucide-react';
import { getUserSession, clearUserSession, isAuthenticated } from '@/lib/auth';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [currentStreak] = useState(7);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/sign-in-page');
      return;
    }
    
    const userData = getUserSession();
    setUser(userData);
  }, [router]);

  const handleSignOut = () => {
    clearUserSession();
    router.push('/sign-in-page');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const todayStats = {
    readinessScore: 85,
    workoutsCompleted: 1,
    activeMinutes: 45,
    caloriesBurned: 320
  };

  const weeklyGoals = [
    { name: 'Workouts', current: 4, target: 5, unit: 'sessions' },
    { name: 'Active Minutes', current: 180, target: 250, unit: 'minutes' },
    { name: 'Calories', current: 1200, target: 1500, unit: 'kcal' }
  ];

  const recentWorkouts = [
    { name: 'Upper Body Strength', duration: '45 min', date: 'Today', status: 'completed' },
    { name: 'HIIT Cardio', duration: '30 min', date: 'Yesterday', status: 'completed' },
    { name: 'Yoga Flow', duration: '20 min', date: '2 days ago', status: 'completed' }
  ];

  const quickActions = [
    { 
      title: 'Start Workout', 
      description: 'Begin your recommended routine',
      icon: Play,
      href: '/exercises-page',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Daily Check-in', 
      description: 'Log your readiness score',
      icon: CheckCircle,
      href: '/daily-readiness-tracker',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      title: 'Track Progress', 
      description: 'View your fitness journey',
      icon: TrendingUp,
      href: '/goals-page',
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      title: 'Browse Exercises', 
      description: 'Explore workout library',
      icon: Dumbbell,
      href: '/exercises-page',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  const readinessFactors = [
    { name: 'Sleep', score: 4, icon: Moon, color: 'text-blue-500' },
    { name: 'Energy', score: 4, icon: Zap, color: 'text-yellow-500' },
    { name: 'Mood', score: 5, icon: Heart, color: 'text-pink-500' },
    { name: 'Recovery', score: 4, icon: Brain, color: 'text-green-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Align
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Link href="/profile-page">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-gray-600">
            You&apos;re on a {currentStreak}-day streak! Keep up the great work.
          </p>
        </div>

        {/* Today's Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-700">Readiness Score</CardTitle>
                <Brain className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 mb-2">{todayStats.readinessScore}%</div>
              <p className="text-xs text-blue-600">Ready for intense training</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-700">Workouts</CardTitle>
                <Dumbbell className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 mb-2">{todayStats.workoutsCompleted}</div>
              <p className="text-xs text-green-600">Completed today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-700">Active Minutes</CardTitle>
                <Timer className="w-4 h-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 mb-2">{todayStats.activeMinutes}</div>
              <p className="text-xs text-purple-600">Minutes today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-orange-700">Calories</CardTitle>
                <Zap className="w-4 h-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 mb-2">{todayStats.caloriesBurned}</div>
              <p className="text-xs text-orange-600">Burned today</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Start your fitness activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer">
                        <CardContent className="p-4">
                          <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${action.gradient} mb-3`}>
                            <action.icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Goals */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-500" />
                      Weekly Goals
                    </CardTitle>
                    <CardDescription>Track your progress this week</CardDescription>
                  </div>
                  <Link href="/goals-page">
                    <Button variant="outline" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {weeklyGoals.map((goal, index) => {
                  const progress = (goal.current / goal.target) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{goal.name}</span>
                        <span className="text-sm text-gray-600">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{Math.round(progress)}% complete</span>
                        <span>{goal.target - goal.current} {goal.unit} remaining</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Readiness Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-500" />
                  Today&apos;s Readiness
                </CardTitle>
                <CardDescription>Your readiness factors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {readinessFactors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <factor.icon className={`w-4 h-4 ${factor.color}`} />
                      <span className="font-medium text-gray-900">{factor.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= factor.score 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{factor.score}/5</span>
                    </div>
                  </div>
                ))}
                <Link href="/daily-readiness-tracker">
                  <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Update Check-in
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Workouts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-green-500" />
                      Recent Workouts
                    </CardTitle>
                    <CardDescription>Your latest activities</CardDescription>
                  </div>
                  <Link href="/exercises-page">
                    <Button variant="outline" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentWorkouts.map((workout, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{workout.name}</p>
                      <p className="text-sm text-gray-500">{workout.date} • {workout.duration}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Completed
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}