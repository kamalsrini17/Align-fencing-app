'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  ArrowLeft,
  Search,
  Filter,
  Heart,
  Clock,
  Users,
  Target,
  Dumbbell,
  Zap,
  Play,
  BookmarkPlus,
  Bookmark,
  Star,
  ChevronRight,
  X,
  CheckCircle
} from 'lucide-react';

interface Exercise {
  id: number;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'strength' | 'cardio' | 'flexibility' | 'plyometric' | 'core' | 'warmup';
  duration: string;
  instructions: string[];
  tips: string[];
  caloriesPerMin: number;
  image?: string;
}

const exercises: Exercise[] = [
  {
    id: 1,
    name: 'Push-ups',
    category: 'Upper Body',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    equipment: ['Bodyweight'],
    difficulty: 'beginner',
    type: 'strength',
    duration: '3-5 sets',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulders',
      'Lower your body until chest nearly touches the floor',
      'Push back up to starting position',
      'Keep your core tight throughout the movement'
    ],
    tips: [
      'Start with knee push-ups if regular push-ups are too difficult',
      'Focus on controlled movement rather than speed',
      'Keep your head in neutral position'
    ],
    caloriesPerMin: 8
  },
  {
    id: 2,
    name: 'Squats',
    category: 'Lower Body',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: ['Bodyweight'],
    difficulty: 'beginner',
    type: 'strength',
    duration: '3-4 sets',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body as if sitting back into a chair',
      'Keep your chest up and knees tracking over toes',
      'Return to standing position'
    ],
    tips: [
      'Keep your weight in your heels',
      'Don&apos;t let knees cave inward',
      'Maintain a straight back throughout'
    ],
    caloriesPerMin: 6
  },
  {
    id: 3,
    name: 'Burpees',
    category: 'Full Body',
    muscleGroups: ['Full Body'],
    equipment: ['Bodyweight'],
    difficulty: 'advanced',
    type: 'plyometric',
    duration: '10-15 reps',
    instructions: [
      'Start standing, then squat down and place hands on ground',
      'Jump feet back into plank position',
      'Do a push-up (optional)',
      'Jump feet back to squat position',
      'Jump up with arms overhead'
    ],
    tips: [
      'Land softly to protect your joints',
      'Modify by stepping instead of jumping',
      'Focus on form over speed'
    ],
    caloriesPerMin: 12
  },
  {
    id: 4,
    name: 'Plank',
    category: 'Core',
    muscleGroups: ['Core', 'Shoulders'],
    equipment: ['Bodyweight'],
    difficulty: 'beginner',
    type: 'core',
    duration: '30-60 seconds',
    instructions: [
      'Start in push-up position',
      'Lower onto forearms',
      'Keep body in straight line from head to heels',
      'Hold position while breathing normally'
    ],
    tips: [
      'Don&apos;t let hips sag or pike up',
      'Engage your core muscles',
      'Start with shorter holds and build up'
    ],
    caloriesPerMin: 3
  },
  {
    id: 5,
    name: 'Running',
    category: 'Cardio',
    muscleGroups: ['Legs', 'Cardiovascular'],
    equipment: ['None'],
    difficulty: 'beginner',
    type: 'cardio',
    duration: '20-60 minutes',
    instructions: [
      'Start with a 5-minute warm-up walk',
      'Maintain a steady, comfortable pace',
      'Land on midfoot, not heel',
      'Keep shoulders relaxed and arms swinging naturally'
    ],
    tips: [
      'Start slowly and build distance gradually',
      'Invest in proper running shoes',
      'Stay hydrated during longer runs'
    ],
    caloriesPerMin: 10
  },
  {
    id: 6,
    name: 'Deadlift',
    category: 'Lower Body',
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
    equipment: ['Barbell', 'Dumbbells'],
    difficulty: 'intermediate',
    type: 'strength',
    duration: '3-5 sets',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Hinge at hips, keeping chest up and back straight',
      'Grip bar with hands shoulder-width apart',
      'Drive through heels to lift, extending hips and knees together'
    ],
    tips: [
      'Keep the bar close to your body throughout',
      'Start with lighter weight to master form',
      'Engage your lats to protect your back'
    ],
    caloriesPerMin: 8
  },
  {
    id: 7,
    name: 'Mountain Climbers',
    category: 'Full Body',
    muscleGroups: ['Core', 'Shoulders', 'Legs'],
    equipment: ['Bodyweight'],
    difficulty: 'intermediate',
    type: 'plyometric',
    duration: '30-60 seconds',
    instructions: [
      'Start in plank position',
      'Bring right knee toward chest',
      'Quickly switch, bringing left knee to chest',
      'Continue alternating at a rapid pace'
    ],
    tips: [
      'Keep hips level throughout movement',
      'Maintain plank position in upper body',
      'Start slower to ensure proper form'
    ],
    caloriesPerMin: 10
  },
  {
    id: 8,
    name: 'Yoga Flow',
    category: 'Flexibility',
    muscleGroups: ['Full Body'],
    equipment: ['Yoga Mat'],
    difficulty: 'beginner',
    type: 'flexibility',
    duration: '20-60 minutes',
    instructions: [
      'Begin in child&apos;s pose to center yourself',
      'Move through sun salutation sequence',
      'Hold each pose for 5-8 breaths',
      'End with relaxation in savasana'
    ],
    tips: [
      'Focus on breath throughout practice',
      'Never force a stretch',
      'Modify poses as needed for your body'
    ],
    caloriesPerMin: 3
  }
];

const categories = ['All', 'Upper Body', 'Lower Body', 'Core', 'Full Body', 'Cardio', 'Flexibility'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const types = ['All', 'Strength', 'Cardio', 'Flexibility', 'Plyometric', 'Core', 'Warmup'];
const equipment = ['All', 'Bodyweight', 'Dumbbells', 'Barbell', 'Resistance Bands', 'Yoga Mat', 'None'];

export default function ExercisesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.muscleGroups.some(mg => mg.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || 
                               exercise.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchesType = selectedType === 'All' || 
                         exercise.type.toLowerCase() === selectedType.toLowerCase();
      const matchesEquipment = selectedEquipment === 'All' || 
                              exercise.equipment.includes(selectedEquipment);
      const matchesFavorites = activeTab !== 'favorites' || favorites.includes(exercise.id);

      return matchesSearch && matchesCategory && matchesDifficulty && 
             matchesType && matchesEquipment && matchesFavorites;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedType, selectedEquipment, favorites, activeTab]);

  const toggleFavorite = (exerciseId: number) => {
    setFavorites(prev => 
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedType('All');
    setSelectedEquipment('All');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strength': return Dumbbell;
      case 'cardio': return Heart;
      case 'flexibility': return Star;
      case 'plyometric': return Zap;
      case 'core': return Target;
      default: return Activity;
    }
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
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Bookmark className="w-3 h-3 mr-1" />
                {favorites.length} Favorites
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercise Library</h1>
          <p className="text-gray-600">
            Discover exercises tailored to your fitness goals and preferences
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search exercises, muscles, or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 lg:gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>

                {(searchTerm || selectedCategory !== 'All' || selectedDifficulty !== 'All' || 
                  selectedType !== 'All' || selectedEquipment !== 'All') && (
                  <Button variant="ghost" onClick={clearAllFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Exercise Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Equipment</label>
                    <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipment.map(eq => (
                          <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="all">All Exercises</TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredExercises.length} of {exercises.length} exercises
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Create Routine
            </Button>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => {
            const TypeIcon = getTypeIcon(exercise.type);
            const isFavorited = favorites.includes(exercise.id);

            return (
              <Card key={exercise.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${
                        exercise.type === 'strength' ? 'from-blue-500 to-blue-600' :
                        exercise.type === 'cardio' ? 'from-red-500 to-red-600' :
                        exercise.type === 'flexibility' ? 'from-green-500 to-green-600' :
                        exercise.type === 'plyometric' ? 'from-yellow-500 to-yellow-600' :
                        'from-purple-500 to-purple-600'
                      }`}>
                        <TypeIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {exercise.name}
                        </CardTitle>
                        <CardDescription>{exercise.category}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(exercise.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {exercise.duration}
                      </Badge>
                    </div>

                    {/* Muscle Groups */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Target Muscles:</p>
                      <div className="flex flex-wrap gap-1">
                        {exercise.muscleGroups.map((muscle, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Equipment */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Equipment:</p>
                      <div className="flex flex-wrap gap-1">
                        {exercise.equipment.map((eq, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-1" />
                        {exercise.caloriesPerMin} cal/min
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {exercise.duration}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1" onClick={() => setSelectedExercise(exercise)}>
                            <Play className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-br ${
                                exercise.type === 'strength' ? 'from-blue-500 to-blue-600' :
                                exercise.type === 'cardio' ? 'from-red-500 to-red-600' :
                                exercise.type === 'flexibility' ? 'from-green-500 to-green-600' :
                                exercise.type === 'plyometric' ? 'from-yellow-500 to-yellow-600' :
                                'from-purple-500 to-purple-600'
                              }`}>
                                <TypeIcon className="w-5 h-5 text-white" />
                              </div>
                              <span>{exercise.name}</span>
                            </DialogTitle>
                            <DialogDescription>
                              {exercise.category} • {exercise.difficulty} • {exercise.type}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Exercise Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Target Muscles</h4>
                                <div className="flex flex-wrap gap-2">
                                  {exercise.muscleGroups.map((muscle, index) => (
                                    <Badge key={index} variant="secondary">{muscle}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Equipment Needed</h4>
                                <div className="flex flex-wrap gap-2">
                                  {exercise.equipment.map((eq, index) => (
                                    <Badge key={index} variant="outline">{eq}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Instructions */}
                            <div>
                              <h4 className="font-semibold mb-3">Instructions</h4>
                              <ol className="space-y-2">
                                {exercise.instructions.map((instruction, index) => (
                                  <li key={index} className="flex items-start space-x-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                      {index + 1}
                                    </span>
                                    <span className="text-gray-700">{instruction}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {/* Tips */}
                            <div>
                              <h4 className="font-semibold mb-3">Pro Tips</h4>
                              <ul className="space-y-2">
                                {exercise.tips.map((tip, index) => (
                                  <li key={index} className="flex items-start space-x-3">
                                    <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" />
                                    <span className="text-gray-700">{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3 pt-4 border-t">
                              <Button 
                                onClick={() => toggleFavorite(exercise.id)}
                                variant={isFavorited ? "default" : "outline"}
                                className="flex-1"
                              >
                                <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-white' : ''}`} />
                                {isFavorited ? 'Favorited' : 'Add to Favorites'}
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <BookmarkPlus className="w-4 h-4 mr-2" />
                                Add to Routine
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No exercises found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more exercises.
            </p>
            <Button onClick={clearAllFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Create Custom Routine</h3>
            <p className="text-sm text-gray-600 mb-4">
              Build your own workout routine with your favorite exercises
            </p>
            <Button variant="outline" className="w-full">
              Get Started
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Join Group Challenges</h3>
            <p className="text-sm text-gray-600 mb-4">
              Participate in community fitness challenges and competitions
            </p>
            <Button variant="outline" className="w-full">
              View Challenges
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Get AI Recommendations</h3>
            <p className="text-sm text-gray-600 mb-4">
              Receive personalized exercise suggestions based on your goals
            </p>
            <Link href="/daily-readiness-tracker">
              <Button variant="outline" className="w-full">
                Update Readiness
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}