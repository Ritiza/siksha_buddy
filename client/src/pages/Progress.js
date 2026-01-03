import React, { useState, useEffect } from 'react';
import { progressAPI } from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Progress = () => {
  const [summary, setSummary] = useState(null);
  const [accuracyData, setAccuracyData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [topics, setTopics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const [summaryRes, accuracyRes, timeRes, topicsRes] = await Promise.all([
        progressAPI.getSummary(),
        progressAPI.getAccuracy(30),
        progressAPI.getTime(30),
        progressAPI.getTopics(),
      ]);

      setSummary(summaryRes.data);
      setAccuracyData(accuracyRes.data);
      setTimeData(timeRes.data);
      setTopics(topicsRes.data);
    } catch (error) {
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress & Analytics</h1>
        <p className="text-gray-600">Track your learning progress and identify areas for improvement</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Total Study Time</p>
            <p className="text-2xl font-bold text-primary-600">
              {Math.round((summary.total_study_time || 0) / 60)}h
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Average Accuracy</p>
            <p className="text-2xl font-bold text-green-600">
              {(summary.average_accuracy || 0).toFixed(1)}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Chapters Studied</p>
            <p className="text-2xl font-bold text-blue-600">
              {summary.total_chapters_studied || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Strongest Subject</p>
            <p className="text-lg font-semibold text-purple-600">
              {summary.strongest_subject_name || 'N/A'}
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Accuracy Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Accuracy Trend (Last 30 Days)</h2>
          {accuracyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avg_accuracy" stroke="#0ea5e9" name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No data available</p>
          )}
        </div>

        {/* Time Spent Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Study Time (Last 30 Days)</h2>
          {timeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_minutes" fill="#10b981" name="Minutes" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No data available</p>
          )}
        </div>
      </div>

      {/* Weak vs Strong Topics */}
      {topics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weak Topics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">⚠️ Weak Topics</h2>
            {topics.weak_topics?.length > 0 ? (
              <div className="space-y-3">
                {topics.weak_topics.map((topic) => (
                  <div key={topic.chapter_id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">{topic.chapter_name}</p>
                      <p className="text-sm text-gray-600">{topic.subject_name}</p>
                    </div>
                    <span className="text-sm font-semibold text-red-600">
                      {(topic.avg_accuracy || 0).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No weak topics identified</p>
            )}
          </div>

          {/* Strong Topics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">✅ Strong Topics</h2>
            {topics.strong_topics?.length > 0 ? (
              <div className="space-y-3">
                {topics.strong_topics.map((topic) => (
                  <div key={topic.chapter_id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">{topic.chapter_name}</p>
                      <p className="text-sm text-gray-600">{topic.subject_name}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      {(topic.avg_accuracy || 0).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No strong topics identified yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;

