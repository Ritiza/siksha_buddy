import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  BookOpenIcon,
  TrophyIcon,
  FireIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { materialsAPI, progressAPI, plannerAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMaterials: 0,
    studyTime: 0,
    accuracy: 0,
    streak: 0
  });
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [todaysPlan, setTodaysPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load materials
      const materialsResponse = await materialsAPI.getAll();
      setRecentMaterials(materialsResponse.data.slice(0, 5));
      
      // Load progress stats
      try {
        const progressResponse = await progressAPI.getSummary();
        setStats({
          totalMaterials: progressResponse.data.total_materials || 0,
          studyTime: progressResponse.data.total_study_time || 0,
          accuracy: progressResponse.data.average_accuracy || 0,
          streak: 7 // Placeholder
        });
      } catch (error) {
        console.log('Progress API not fully implemented yet');
      }

      // Load today's plan
      try {
        const planResponse = await plannerAPI.getToday();
        setTodaysPlan(planResponse.data);
      } catch (error) {
        console.log('Planner API not fully implemented yet');
      }

    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    {
      name: 'Study Materials',
      value: stats.totalMaterials,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      href: '/materials'
    },
    {
      name: 'Study Time (mins)',
      value: stats.studyTime,
      icon: ClockIcon,
      color: 'bg-green-500',
      href: '/progress'
    },
    {
      name: 'Average Accuracy',
      value: `${stats.accuracy.toFixed(1)}%`,
      icon: TrophyIcon,
      color: 'bg-yellow-500',
      href: '/progress'
    },
    {
      name: 'Study Streak',
      value: `${stats.streak} days`,
      icon: FireIcon,
      color: 'bg-red-500',
      href: '/progress'
    }
  ];

  const quickActions = [
    {
      name: 'Upload Material',
      description: 'Add new study content',
      icon: DocumentTextIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      href: '/materials'
    },
    {
      name: 'Take Quiz',
      description: 'Test your knowledge',
      icon: AcademicCapIcon,
      color: 'bg-purple-600 hover:bg-purple-700',
      href: '/tests'
    },
    {
      name: 'View Progress',
      description: 'Check your performance',
      icon: ChartBarIcon,
      color: 'bg-green-600 hover:bg-green-700',
      href: '/progress'
    },
    {
      name: 'Study Planner',
      description: 'Plan your study schedule',
      icon: CalendarDaysIcon,
      color: 'bg-orange-600 hover:bg-orange-700',
      href: '/planner'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-blue-100">Ready to continue your learning journey? Let's make today productive!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  to={action.href}
                  className={`p-4 rounded-lg text-white transition-colors ${action.color}`}
                >
                  <div className="flex items-center">
                    <action.icon className="h-6 w-6" />
                    <div className="ml-3">
                      <p className="font-medium">{action.name}</p>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Materials */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Materials</h2>
              <Link to="/materials" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all
              </Link>
            </div>
            {recentMaterials.length > 0 ? (
              <div className="space-y-3">
                {recentMaterials.map((material) => (
                  <div key={material.material_id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <BookOpenIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{material.file_name}</p>
                      <p className="text-xs text-gray-500">
                        {material.subject_name || 'General'} • {material.estimated_study_time || 0} min read
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {material.file_type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No materials yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by uploading your first study material.</p>
                <div className="mt-6">
                  <Link
                    to="/materials"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" />
                    Upload Material
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Today's Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Plan</h2>
          {todaysPlan && todaysPlan.tasks ? (
            <div className="space-y-3">
              {todaysPlan.tasks.slice(0, 4).map((task, index) => (
                <div key={task.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'High' ? 'bg-red-400' :
                      task.priority === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.subject} • {task.estimated_time} min</p>
                  </div>
                </div>
              ))}
              <Link
                to="/planner"
                className="block w-full text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View full plan
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No plan for today</h3>
              <p className="mt-1 text-sm text-gray-500">Create a study plan to stay organized.</p>
              <div className="mt-4">
                <Link
                  to="/planner"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                >
                  Create Plan
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;