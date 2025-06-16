'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  ArrowLeft,
  Target,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Award,
  Zap,
  Heart,
  Dumbbell,
  Timer
} from 'lucide-react';

interface Goal {
  id: number;
  title: string;
  description: string;
  category: 'fitness' | 'health' | 'performance';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: 'Weekly Workouts',
      description: 'Complete 5 workouts per week',
      category: 'fitness',
      targetValue: 5,
      currentValue: 3,
      unit: 'workouts',
      deadline: '2025-02-01',
      status: 'active',
      priority: 'high',
      createdAt: '2025-01-01'
    },
    {
      id: 2,
      title: 'Weight Loss',
      description: 'Lose 10 pounds in 3 months',
      category: 'health',
      targetValue: 10,
      currentValue: 3,
      unit: 'lbs',
      deadline: '2025-04-01',
      status: 'active',
      priority: 'high',
      createdAt: '2025-01-01'
    },
    {
      id: 3,
      title: 'Running Distance',
      description: 'Run 100 miles this month',
      category: 'performance',
      targetValue: 100,
      currentValue: 45,
      unit: 'miles',
      deadline: '2025-01-31',
      status: 'active',
      priority: 'medium',
      createdAt: '2025-01-01'
    },
    {
      id: 4,
      title: 'Push-up Challenge',
      description: 'Do 1000 push-ups this month',
      category: 'fitness',
      targetValue: 1000,
      currentValue: 1000,
      unit: 'reps',
      deadline: '2025-01-31',
      status: 'completed',
      priority: 'medium',
      createdAt: '2024-12-01'
    }
  ]);

  const [activeTab, setActiveTab] = useState('active');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'fitness' as const,
    targetValue: 0,
    unit: '',
    deadline: '',
    priority: 'medium' as const
  });

  const filteredGoals = goals.filter(goal => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return goal.status === 'completed';
    return goal.status === 'active';
  });

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return Dumbbell;
      case 'health': return Heart;
      case 'performance': return Zap;
      default: return Target;
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetValue || !newGoal.unit || !newGoal.deadline) return;

    const goal: Goal = {
      id: Date.now(),
      ...newGoal,
      currentValue: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'fitness',
      targetValue: 0,
      unit: '',
      deadline: '',
      priority: 'medium'
    });
    setIsAddingGoal(false);
  };

  const updateGoalProgress = (goalId: number, newValue: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            currentValue: newValue,
            status: newValue >= goal.targetValue ? 'completed' : 'active'
          }
        : goal
    ));
  };

  const deleteGoal = (goalId: number) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const stats = {
    totalGoals: goals.length,
    activeGoals: goals.filter(g => g.status === 'active').length,
    completedGoals: goals.filter(g => g.status === 'completed').length,
    completionRate: Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Align
                </span>
              </div>
            </div>
            <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>
                    Set a new fitness goal to track your progress
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Weekly Workouts"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="e.g., Complete 5 workouts per week"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newGoal.category} onValueChange={(value: any) => setNewGoal(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fitness">Fitness</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newGoal.priority} onValueChange={(value: any) => setNewGoal(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="target">Target Value</Label>
                      <Input
                        id="target"
                        type="number"
                        value={newGoal.targetValue || ''}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 0 }))}
                        placeholder="e.g., 5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Input
                        id="unit"
                        value={newGoal.unit}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                        placeholder="e.g., workouts, lbs, miles"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddingGoal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleAddGoal} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                      Create Goal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Goals & Progress</h1>
          <p className="text-gray-600">
            Track your fitness journey and achieve your goals
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Goals</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalGoals}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Active Goals</p>
                  <p className="text-2xl font-bold text-green-900">{stats.activeGoals}</p>
                </div>
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Completed</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.completedGoals}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Success Rate</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.completionRate}%</p>
                </div>
                <Award className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="active">Active ({stats.activeGoals})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({stats.completedGoals})</TabsTrigger>
            <TabsTrigger value="all">All Goals ({stats.totalGoals})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const CategoryIcon = getCategoryIcon(goal.category);
            const progress = getProgressPercentage(goal.currentValue, goal.targetValue);
            const isCompleted = goal.status === 'completed';
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

            return (
              <Card key={goal.id} className={`border-0 shadow-lg ${isCompleted ? 'bg-gradient-to-br from-green-50 to-green-100' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        goal.category === 'fitness' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                        goal.category === 'health' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                        'bg-gradient-to-br from-yellow-500 to-yellow-600'
                      }`}>
                        <CategoryIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{Math.round(progress)}% complete</span>
                        <span>{goal.targetValue - goal.currentValue} {goal.unit} remaining</span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                      <div className={`flex items-center ${daysLeft < 7 ? 'text-red-600' : 'text-gray-600'}`}>
                        <Timer className="w-4 h-4 mr-1" />
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                      </div>
                    </div>

                    {/* Actions */}
                    {!isCompleted && (
                      <div className="flex space-x-2 pt-2">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="Update progress"
                            min="0"
                            max={goal.targetValue}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const value = parseInt((e.target as HTMLInputElement).value);
                                if (value >= 0 && value <= goal.targetValue) {
                                  updateGoalProgress(goal.id, value);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteGoal(goal.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'completed' ? 'No completed goals yet' : 'No active goals'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'completed' 
                ? 'Complete some goals to see them here.' 
                : 'Create your first goal to start tracking your progress.'
              }
            </p>
            {activeTab !== 'completed' && (
              <Button onClick={() => setIsAddingGoal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Goal
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}