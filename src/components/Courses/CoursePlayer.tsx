import React, { useState } from 'react';
import { Course, User, Enrollment, Certificate } from '../../types';
import { ArrowLeft, CheckCircle2, Circle, PlayCircle, FileText, HelpCircle, Award, Sparkles, Send } from 'lucide-react';

interface CoursePlayerProps {
  course: Course;
  currentUser: User;
  enrollment?: Enrollment;
  onCompleteLesson: (courseId: string, lessonId: string) => void;
  onSubmitQuiz: (courseId: string, score: number) => void;
  onSubmitAssignment: (assignmentId: string, content: string) => void;
  onGenerateCertificate: (courseId: string) => void;
  onBack: () => void;
  onOpenAITutorWithContext: (courseTitle: string, lessonTitle: string) => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  currentUser,
  enrollment,
  onCompleteLesson,
  onSubmitQuiz,
  onSubmitAssignment,
  onGenerateCertificate,
  onBack,
  onOpenAITutorWithContext,
}) => {
  const allLessons = course.modules.flatMap(m => m.lessons);
  const [activeLessonId, setActiveLessonId] = useState<string>(allLessons[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'assignment'>('content');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Assignment state
  const [assignmentContent, setAssignmentContent] = useState('');
  const [assignmentSubmittedSuccess, setAssignmentSubmittedSuccess] = useState(false);

  const activeLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];
  const completedLessons = enrollment?.completedLessons || [];
  const progress = enrollment?.progress || 0;

  const handleLessonComplete = () => {
    if (activeLesson) {
      onCompleteLesson(course.id, activeLesson.id);
    }
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course.quiz) return;

    let correctCount = 0;
    course.quiz.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / course.quiz.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    onSubmitQuiz(course.id, score);
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course.assignment || !assignmentContent.trim()) return;
    onSubmitAssignment(course.assignment.id, assignmentContent);
    setAssignmentSubmittedSuccess(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-16 z-30 shadow-xs">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors flex items-center space-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold hidden sm:inline">Back to Dashboard</span>
          </button>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-md">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <span className="block text-xs font-semibold text-slate-600">Course Progress</span>
              <span className="text-xs font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <button
            onClick={() => onOpenAITutorWithContext(course.title, activeLesson?.title || 'General')}
            className="px-3.5 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold text-xs transition-colors flex items-center space-x-1.5 border border-violet-200"
          >
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="hidden sm:inline">Ask AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 sm:p-6 lg:p-8">
        {/* Left Sidebar: Course Curriculum */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs h-fit space-y-4">
          <h3 className="font-bold text-slate-900 text-sm px-2 uppercase tracking-wider text-slate-400">
            Course Curriculum
          </h3>

          <div className="space-y-4">
            {course.modules.map((module, mIdx) => (
              <div key={module.id} className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 px-2">
                  {module.title}
                </h4>
                <div className="space-y-1">
                  {module.lessons.map((lesson) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isActive = lesson.id === activeLessonId && activeTab === 'content';

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setActiveLessonId(lesson.id);
                          setActiveTab('content');
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          {isCompleted ? (
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                          ) : (
                            <Circle className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-200' : 'text-slate-300'}`} />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className={`text-[10px] shrink-0 ml-2 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quiz & Assignment Tabs */}
            {course.quiz && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-colors ${
                  activeTab === 'quiz' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Course Quiz</span>
              </button>
            )}

            {course.assignment && (
              <button
                onClick={() => setActiveTab('assignment')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-colors ${
                  activeTab === 'assignment' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Assignment</span>
              </button>
            )}

            {/* Certificate Button if 100% completed */}
            {progress >= 100 && (
              <button
                onClick={() => onGenerateCertificate(course.id)}
                className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Award className="w-4 h-4" />
                <span>View Certificate</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Main Viewer Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'content' && activeLesson && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Simulated Video Player */}
              <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="text-center z-10 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/50 cursor-pointer transition-transform hover:scale-110">
                    <PlayCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-white font-bold text-sm block">{activeLesson.title}</span>
                    <span className="text-indigo-200 text-xs">{activeLesson.duration} • Video Lesson</span>
                  </div>
                </div>
              </div>

              {/* Lesson Title & Mark Complete */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{activeLesson.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">Instructor: {course.instructorName}</p>
                </div>

                <button
                  onClick={handleLessonComplete}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-xs shadow-xs transition-all flex items-center space-x-2 ${
                    completedLessons.includes(activeLesson.id)
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{completedLessons.includes(activeLesson.id) ? 'Completed' : 'Mark as Complete'}</span>
                </button>
              </div>

              {/* Lesson Content Body */}
              <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Lesson Notes & Overview</h4>
                <p>{activeLesson.content}</p>
                <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-indigo-900 text-xs space-y-2">
                  <p className="font-bold flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>AI Study Tip</span>
                  </p>
                  <p>Have questions about this lesson? Click the "Ask AI Tutor" button above to get instant explanations and code examples tailored to your learning pace.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && course.quiz && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{course.quiz.title}</h2>
                <p className="text-xs text-slate-500 mt-1">Test your understanding of the core concepts covered in this course.</p>
              </div>

              {quizSubmitted ? (
                <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-3">
                  <Award className="w-12 h-12 text-indigo-600 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">Quiz Completed!</h3>
                  <p className="text-2xl font-extrabold text-indigo-600">{quizScore}%</p>
                  <p className="text-xs text-slate-600">
                    {quizScore! >= 70 ? 'Fantastic job! You passed the quiz with flying colors.' : 'Good effort! Review the lesson notes and try again.'}
                  </p>
                  <button
                    onClick={() => setQuizSubmitted(false)}
                    className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
                  >
                    Retake Quiz
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuizSubmit} className="space-y-6">
                  {course.quiz.questions.map((q, idx) => (
                    <div key={q.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <p className="text-sm font-bold text-slate-800">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <label
                            key={oIdx}
                            className={`flex items-center space-x-3 p-3 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                              quizAnswers[q.id] === oIdx
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-900'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={quizAnswers[q.id] === oIdx}
                              onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: oIdx })}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all"
                  >
                    Submit Quiz Answers
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'assignment' && course.assignment && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{course.assignment.title}</h2>
                <p className="text-xs text-slate-500 mt-1">Due: {new Date(course.assignment.dueDate).toLocaleDateString()} • {course.assignment.points} Points</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider">Assignment Description</h4>
                <p>{course.assignment.description}</p>
              </div>

              {assignmentSubmittedSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-900">Assignment Submitted Successfully!</h3>
                  <p className="text-xs text-emerald-700">Your instructor will review your submission and provide feedback soon.</p>
                </div>
              ) : (
                <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Your Solution / Submission URL / Notes
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={assignmentContent}
                      onChange={(e) => setAssignmentContent(e.target.value)}
                      placeholder="Paste your GitHub repository link, deployment URL, or written solution here..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Assignment for Grading</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
