import React, { useState, useEffect } from 'react';
import { plannerAPI } from '../services/api';
import toast from 'react-hot-toast';

const Planner = () => {
  const [todayPlan, setTodayPlan] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadTodayPlan();
  }, []);

  const loadTodayPlan = async () => {
    try {
      const response = await plannerAPI.getToday();
      setTodayPlan(response.data);
    } catch (error) {
      toast.error('Failed to load today\'s plan');
    }
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      const response = await plannerAPI.generate();
      setStudyPlan(response.data);
      toast.success('Study plan generated!');
    } catch (error) {
      toast.error('Failed to generate plan');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Planner</h1>
        <p className="text-gray-600">Plan your study schedule and track your progress</p>
      </div>

      {/* Generate Plan Button */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <button
          onClick={handleGeneratePlan}
          disabled={generating}
          className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {generating ? 'Generating Plan...' : 'Generate Study Plan'}
        </button>
      </div>

      {/* Today's Plan */}
      {todayPlan && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Today's Plan ({todayPlan.days_remaining} days remaining)
          </h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Daily Study Time: {todayPlan.daily_time_minutes} minutes</p>
          </div>

          {todayPlan.today_sessions?.length > 0 ? (
            <div className="space-y-3">
              {todayPlan.today_sessions.map((session) => (
                <div key={session.session_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{session.chapter_name || 'General Study'}</p>
                    <p className="text-sm text-gray-600">{session.mode}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {session.time_spent_minutes} min
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No sessions scheduled for today</p>
          )}

          {todayPlan.upcoming_revisions?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Upcoming Revisions</h3>
              <div className="space-y-2">
                {todayPlan.upcoming_revisions.map((revision) => (
                  <div key={revision.revision_id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span>{revision.chapter_name}</span>
                    <span className="text-sm text-yellow-700 font-medium">
                      {revision.weakness_level} priority
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generated Study Plan */}
      {studyPlan && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Your Personalized Study Plan</h2>
          {typeof studyPlan.plan === 'object' ? (
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
              {JSON.stringify(studyPlan.plan, null, 2)}
            </pre>
          ) : (
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{studyPlan.plan}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Planner;

