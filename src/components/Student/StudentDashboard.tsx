import React, { useState } from 'react';
import { User, Course, Enrollment, Certificate } from '../../types';
import { BookOpen, CheckCircle, Award, PlayCircle, Clock, Star, ArrowRight, FileText, CheckSquare, Sparkles } from 'lucide-react';

interface StudentDashboardProps {
  currentUser: User;
  courses: Course[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  onEnroll: (courseId: string) => void;
  onOpenCoursePlayer: (course: Course) => void;
  onViewCertificates: () => void;
  onBrowseCatalog: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  courses,
  enrollments,
  certificates,
  onEnroll,
  onOpenCoursePlayer,
  onViewCertificates,
  onBrowseCatalog,
}) => {
  const userEnrollments = enrollments.filter(e => e.userId === currentUser.id);
  const enrolledCourseIds = userEnrollments.map(e => e.courseId);
  const myCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
  const completedCount = userEnrollments.filter(e => e.isCompleted).length;
  const userCerts = certificates.filter(c => c.userId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Welcome back, {currentUser.name}!</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Continue Your Learning Journey
          </h1>
          <p className="text-indigo-200 text-sm sm:text-base mt-2">
            You are enrolled in {myCourses.length} active courses. Keep up the great pace and earn certificates to showcase your mastery.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-indigo-700/60 max-w-lg">
            <div>
              <span className="block text-2xl font-bold text-white">{myCourses.length}</span>
              <span className="text-xs text-indigo-300">Enrolled Courses</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-white">{completedCount}</span>
              <span className="text-xs text-indigo-300">Completed</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-white">{userCerts.length}</span>
              <span className="text-xs text-indigo-300">Certificates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Enrolled Courses</h2>
            <p className="text-sm text-slate-500">Pick up right where you left off</p>
          </div>
          <button
            onClick={onBrowseCatalog}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>Browse More Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {myCourses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-800">No courses enrolled yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
              Explore our comprehensive course catalog and start learning today.
            </p>
            <button
              onClick={onBrowseCatalog}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all"
            >
              Explore Course Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course) => {
              const enr = userEnrollments.find(e => e.courseId === course.id);
              const progress = enr ? enr.progress : 0;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-xs">
                      {course.category}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
                      <span>{course.instructorName}</span>
                      <span>•</span>
                      <span>{course.level}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="mt-auto space-y-2 pt-4">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-600">Progress</span>
                        <span className="text-indigo-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <button
                        onClick={() => onOpenCoursePlayer(course)}
                        className="w-full mt-3 py-2.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center space-x-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>{progress === 100 ? 'Review Course' : 'Continue Learning'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended Catalog Preview */}
      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Featured Course Catalog</h2>
            <p className="text-sm text-slate-500">Expand your skills with expert-led courses</p>
          </div>
          <button
            onClick={onBrowseCatalog}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>View All ({courses.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="h-40 overflow-hidden bg-slate-100">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{course.category}</span>
                    <div className="flex items-center space-x-1 text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2 line-clamp-2">{course.title}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900">${course.price}</span>
                    {isEnrolled ? (
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg">
                        Enrolled
                      </span>
                    ) : (
                      <button
                        onClick={() => onEnroll(course.id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
