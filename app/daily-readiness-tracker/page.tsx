'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Activity, 
  ArrowLeft,
  Moon,
  Zap,
  Heart,
  Dumbbell,
  Brain,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

interface ReadinessFactor {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  value: number;
  tips: string[];
}

export default function DailyReadinessTracker() {
  const [factors, setFactors] = useState<ReadinessFactor[]>([
    {
      id: 'sleep',
      name: 'Sleep Quality',
      description: 'How well did you sleep last night?',
      icon: Moon,
      color: 'text-blue-500',
      value: 3,
      tips: [
        'Aim for 7-9 hours of sleep',
        'Keep a consistent sleep schedule',
        'Avoid screens before bedtime'
      ]
    },
    {
      id: 'energy',
      name: 'Energy Level',
      description: 'How energetic do you feel right now?',
      icon: Zap,
      color: 'text-yellow-500',
      value: 4,
      tips: [
        'Stay hydrated throughout the day',
        'Eat balanced meals',
        'Take short breaks during work'
      ]
    },
    {
      id: 'mood',
      name: 'Mood',
      description: 'How is your overall mood today?',
      icon: Heart,
      color: 'text-pink-500',
      value: 4,
      tips: [
        'Practice gratitude',
        'Connect with friends',
        'Do activities you enjoy'
      ]
    },
    {
      id: 'soreness',
      name: 'Muscle Soreness',
      description: 'How sore are your muscles? (1 = very sore, 5 = no soreness)',
      icon: Dumbbell,
      color: 'text-orange-500',
      value: 3,
      tips: [
        'Do light stretching',
        'Take a warm bath',
        'Consider a rest day if very sore'
      ]
    },
    {
      id: 'stress',
      name: 'Stress Level',
      description: 'How stressed do you feel? (1 = very stressed, 5 = no stress)',
      icon: Brain,
      color: 'text-purple-500',
      value: 3,
      tips: [
        'Practice deep breathing',
        'Try meditation',
        'Take a short walk'
      ]
    }
  ]);

  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateFactor = (id: string, value: number) => {
    setFactors(prev => prev.map(factor => 
      factor.id === id ? { ...factor, value } : factor
    ));
  };

  const calculateReadinessScore = () => {
    const total = factors.reduce((sum, factor) => sum + factor.value, 0);
    return Math.round((total / (factors.length * 5)) * 100);
  };

  const getReadinessLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 40) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getWorkoutRecommendation = (score: number) => {
    if (score >= 80) {
      return {
        type: 'High Intensity',
        description: 'You\'re ready for challenging workouts today!',
        icon: '🔥',
        suggestions: ['HIIT training', 'Heavy strength training', 'Sport activities']
      };
    }
    if (score >= 60) {
      return {
        type: 'Moderate Intensity',
        description: 'Moderate workouts will serve you well today.',
        icon: '💪',
        suggestions: ['Moderate cardio', 'Regular strength training', 'Circuit training']
      };
    }
    if (score >= 40) {
      return {
        type: 'Light Activity',
        description: 'Consider lighter activities today.',
        icon: '🚶',
        suggestions: ['Walking', 'Light yoga', 'Stretching', 'Easy cycling']
      };
    }
    return {
      type: 'Rest & Recovery',
      description: 'Focus on recovery today.',
      icon: '🛌',
      suggestions: ['Gentle stretching', 'Meditation', 'Light walking', 'Rest day']
    };
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Here you would save the data to your backend
    console.log('Readiness data:', { factors, notes, score: calculateReadinessScore() });
  };

  const readinessScore = calculateReadinessScore();
  const readinessLevel = getReadinessLevel(readinessScore);
  const workoutRec = getWorkoutRecommendation(readinessScore);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check-in Complete!</h2>
            <p className="text-gray-600 mb-6">Your readiness score has been recorded.</p>
            
            <div className="space-y-4 mb-6">
              <div className={`p-4 rounded-lg ${readinessLevel.bg}`}>
                <div className="text-3xl font-bold mb-1">{readinessScore}%</div>
                <div className={`text-sm font-medium ${readinessLevel.color}`}>
                  {readinessLevel.level} Readiness
                </div>
              </div>
              
              <div className="text-left p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{workoutRec.icon}</span>
                  <span className="font-semibold">{workoutRec.type}</span>
                </div>
                <p className="text-sm text-gray-600">{workoutRec.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link href="/dashboard">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/exercises-page">
                <Button variant="outline" className="w-full">
                  Start Recommended Workout
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short', 
                day: 'numeric' 
              })}
            </Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Readiness Check-in</h1>
          <p className="text-gray-600">
            Rate how you're feeling today to get personalized workout recommendations
          </p>
        </div>

        {/* Current Score Preview */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{readinessScore}%</div>
              <Badge className={`${readinessLevel.bg} ${readinessLevel.color} border-0 text-sm px-3 py-1`}>
                {readinessLevel.level} Readiness
              </Badge>
              <Progress value={readinessScore} className="mt-4 h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Readiness Factors */}
        <div className="space-y-6 mb-8">
          {factors.map((factor) => (
            <Card key={factor.id} className="border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <factor.icon className={`w-5 h-5 ${factor.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{factor.name}</CardTitle>
                    <CardDescription>{factor.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{factor.value}</div>
                    <div className="text-sm text-gray-500">/ 5</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="px-3">
                    <Slider
                      value={[factor.value]}
                      onValueChange={(values) => updateFactor(factor.id, values[0])}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                  
                  {factor.value <= 2 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800 mb-1">
                            Tips to improve your {factor.name.toLowerCase()}:
                          </p>
                          <ul className="text-xs text-yellow-700 space-y-1">
                            {factor.tips.map((tip, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-1">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workout Recommendation */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Today's Workout Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="text-4xl">{workoutRec.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{workoutRec.type}</h3>
                <p className="text-gray-600 mb-2">{workoutRec.description}</p>
                <div className="flex flex-wrap gap-2">
                  {workoutRec.suggestions.map((suggestion, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Additional Notes (Optional)</CardTitle>
            <CardDescription>
              Any other factors affecting how you feel today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., Had a stressful day at work, feeling excited about the weekend, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Complete Check-in
          </Button>
        </div>
      </div>
    </div>
  );
}