import React, { useState } from 'react';
import { User, Course, Assignment } from '../../types';
import { PlusCircle, BookOpen, Users, Award, Sparkles, CheckCircle, Clock, Star } from 'lucide-react';

interface InstructorDashboardProps {
  currentUser: User;
  courses: Course[];
  assignments: any[];
  onCreateCourse: (courseData: any) => void;
  onGradeAssignment: (assignmentId: string, grade: number, feedback: string) => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  currentUser,
  courses,
  assignments,
  onCreateCourse,
  onGradeAssignment,
}) => {
  const myCourses = courses.filter(c => c.instructorId === currentUser.id);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiLevel, setAiLevel] = useState('Intermediate');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // Manual course form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [price, setPrice] = useState('49.99');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600');

  // Grading modal state
  const [gradingAssignment, setGradingAssignment] = useState<any | null>(null);
  const [gradeValue, setGradeValue] = useState('95');
  const [feedbackValue, setFeedbackValue] = useState('Excellent execution and clean code structure!');

  const handleAISyllabusGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic) return;

    setGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/gemini/syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic, level: aiLevel })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate syllabus');

      // Populate form with AI generated data
      setTitle(data.title || aiTopic);
      setDescription(data.description || `Master ${aiTopic} with expert instruction.`);
      setCategory(data.category || 'Technology');
      setLevel(aiLevel as any);

      // Create course with AI modules
      onCreateCourse({
        title: data.title || aiTopic,
        description: data.description || `Master ${aiTopic} with expert instruction.`,
        category: data.category || 'Technology',
        level: aiLevel,
        instructorId: currentUser.id,
        instructorName: currentUser.name,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
        price: 79.99,
        modules: data.modules || [],
        quiz: {
          id: `q-${Date.now()}`,
          title: `${aiTopic} Final Assessment`,
          questions: [
            {
              id: `qq-${Date.now()}`,
              question: `What is a core principle in ${aiTopic}?`,
              options: ['Scalability & Modular Design', 'Monolithic Coupling', 'Ignoring Tests', 'Hardcoding Secrets'],
              correctAnswer: 0,
              explanation: 'Scalability and modular design ensure maintainable architectures.'
            }
          ]
        },
        assignment: {
          id: `asg-${Date.now()}`,
          title: `${aiTopic} Capstone Project`,
          description: `Build a real-world application or analysis report applying the concepts learned in ${aiTopic}.`,
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
          points: 100
        }
      });

      setShowCreateModal(false);
      setAiTopic('');
    } catch (err: any) {
      setError(err.message || 'AI generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    onCreateCourse({
      title,
      description,
      category,
      level,
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      thumbnail,
      price: parseFloat(price) || 0,
      modules: [
        {
          id: `m-${Date.now()}-1`,
          title: 'Module 1: Foundations',
          lessons: [
            { id: `l-${Date.now()}-1`, title: 'Introduction to ' + title, duration: '15 min', content: 'Core concepts and roadmap overview.', isCompleted: false }
          ]
        }
      ],
      assignment: {
        id: `asg-${Date.now()}`,
        title: `${title} Assignment`,
        description: 'Complete the practical lab exercises.',
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        points: 100
      }
    });

    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Instructor Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Course Management & Grading</h1>
          <p className="text-sm text-slate-500 mt-0.5">Create courses with AI syllabus generation and grade student assignments.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Course with AI</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-900">{myCourses.length}</span>
            <span className="text-xs text-slate-500">My Courses Created</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-900">
              {myCourses.reduce((acc, c) => acc + c.enrolledCount, 0)}
            </span>
            <span className="text-xs text-slate-500">Total Enrolled Students</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-900">
              {assignments.filter(a => a.submission && !a.submission.grade).length}
            </span>
            <span className="text-xs text-slate-500">Pending Submissions</span>
          </div>
        </div>
      </div>

      {/* My Created Courses */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">My Created Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
              <div className="h-40 bg-slate-100 relative">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800">
                  {course.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{course.description}</p>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>{course.enrolledCount} students</span>
                  <span className="font-bold text-indigo-600">${course.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Assignments Grading Section */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Student Assignment Submissions</h2>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="p-4">Student</th>
                  <th className="p-4">Assignment</th>
                  <th className="p-4">Submitted At</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.filter(a => a.submission).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No student submissions yet.
                    </td>
                  </tr>
                ) : (
                  assignments.filter(a => a.submission).map((asg) => (
                    <tr key={asg.id} className="hover:bg-slate-50/80">
                      <td className="p-4 font-bold text-slate-900">{asg.submission.studentName}</td>
                      <td className="p-4 font-medium text-slate-700">{asg.title}</td>
                      <td className="p-4 text-slate-500">{new Date(asg.submission.submittedAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        {asg.submission.grade !== undefined ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px]">
                            Graded: {asg.submission.grade}/100
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-full text-[10px]">
                            Needs Grading
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setGradingAssignment(asg)}
                          className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-semibold rounded-xl transition-colors"
                        >
                          {asg.submission.grade !== undefined ? 'Edit Grade' : 'Grade Submission'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Course Modal with AI Syllabus Generator */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-900">AI Course Syllabus Generator</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <p className="text-xs text-slate-500">
              Enter any topic or subject you want to teach. Our AI will automatically generate a professional course syllabus, modules, lessons, and quizzes!
            </p>

            {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl">{error}</div>}

            <form onSubmit={handleAISyllabusGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Course Topic / Subject *
                </label>
                <input
                  type="text"
                  required
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Advanced Cloud Architecture & Kubernetes"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Target Level
                </label>
                <select
                  value={aiLevel}
                  onChange={(e) => setAiLevel(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{generating ? 'Generating AI Syllabus...' : 'Generate with AI'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Assignment Modal */}
      {gradingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Grade Student Assignment</h3>
              <button onClick={() => setGradingAssignment(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <p><span className="font-bold text-slate-700">Student:</span> {gradingAssignment.submission.studentName}</p>
              <p><span className="font-bold text-slate-700">Assignment:</span> {gradingAssignment.title}</p>
              <p><span className="font-bold text-slate-700">Student Submission:</span></p>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800 font-mono">
                {gradingAssignment.submission.content}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onGradeAssignment(gradingAssignment.id, parseFloat(gradeValue), feedbackValue);
                setGradingAssignment(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Grade (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Feedback & Notes</label>
                <textarea
                  rows={3}
                  value={feedbackValue}
                  onChange={(e) => setFeedbackValue(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingAssignment(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md"
                >
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
