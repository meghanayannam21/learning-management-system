import React, { useState, useEffect } from 'react';
import { User, Course, Enrollment, Certificate, Assignment } from './types';
import { INITIAL_USERS, INITIAL_COURSES, INITIAL_ENROLLMENTS, INITIAL_CERTIFICATES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/Auth/LoginPage';
import { RegisterPage } from './components/Auth/RegisterPage';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { CourseCatalog } from './components/Courses/CourseCatalog';
import { CoursePlayer } from './components/Courses/CoursePlayer';
import { InstructorDashboard } from './components/Instructor/InstructorDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AITutorChat } from './components/AITutor/AITutorChat';
import { CertificateModal } from './components/Certificates/CertificateModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[3]); // Default to student Alex Rivera
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(INITIAL_ENROLLMENTS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [selectedCourseForPlayer, setSelectedCourseForPlayer] = useState<Course | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [aiTutorContext, setAiTutorContext] = useState<{ courseTitle?: string; lessonTitle?: string }>({});

  useEffect(() => {
    // Fetch courses and assignments on load
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCourses(data); })
      .catch(() => {});

    fetch('/api/assignments')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setAssignments(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetch(`/api/enrollments/${currentUser.id}`)
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setEnrollments(data); })
        .catch(() => {});

      fetch(`/api/certificates/${currentUser.id}`)
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setCertificates(data); })
        .catch(() => {});
    }
  }, [currentUser]);

  const handleEnroll = async (courseId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, courseId })
      });
      const newEnr = await res.json();
      setEnrollments(prev => [...prev.filter(e => e.id !== newEnr.id), newEnr]);
      
      // Open course player directly
      const course = courses.find(c => c.id === courseId);
      if (course) {
        setSelectedCourseForPlayer(course);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteLesson = async (courseId: string, lessonId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/lessons/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, courseId, lessonId })
      });
      const updatedEnr = await res.json();
      setEnrollments(prev => prev.map(e => e.id === updatedEnr.id ? updatedEnr : e));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitQuiz = async (courseId: string, score: number) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, courseId, score })
      });
      const data = await res.json();
      if (data.enrollment) {
        setEnrollments(prev => prev.map(e => e.id === data.enrollment.id ? data.enrollment : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitAssignment = async (assignmentId: string, content: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, studentId: currentUser.id, studentName: currentUser.name, content })
      });
      const data = await res.json();
      // Refresh assignments
      fetch('/api/assignments')
        .then(r => r.json())
        .then(d => { if (Array.isArray(d)) setAssignments(d); });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGradeAssignment = async (assignmentId: string, grade: number, feedback: string) => {
    try {
      await fetch('/api/assignments/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, grade, feedback })
      });
      fetch('/api/assignments')
        .then(r => r.json())
        .then(d => { if (Array.isArray(d)) setAssignments(d); });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateCertificate = async (courseId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, courseId })
      });
      const cert = await res.json();
      setCertificates(prev => [...prev.filter(c => c.id !== cert.id), cert]);
      setSelectedCertificate(cert);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCourse = async (courseData: any) => {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      const newCourse = await res.json();
      setCourses(prev => [newCourse, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedCourseForPlayer(null);
          setActiveTab(tab);
        }}
        onLogout={() => {
          setCurrentUser(null);
          setActiveTab('login');
          setSelectedCourseForPlayer(null);
        }}
        onOpenAITutor={() => {
          setAiTutorContext({});
          setIsAITutorOpen(true);
        }}
      />

      <main className="pb-16">
        {selectedCourseForPlayer && currentUser ? (
          <CoursePlayer
            course={selectedCourseForPlayer}
            currentUser={currentUser}
            enrollment={enrollments.find(e => e.userId === currentUser.id && e.courseId === selectedCourseForPlayer.id)}
            onCompleteLesson={handleCompleteLesson}
            onSubmitQuiz={handleSubmitQuiz}
            onSubmitAssignment={handleSubmitAssignment}
            onGenerateCertificate={handleGenerateCertificate}
            onBack={() => setSelectedCourseForPlayer(null)}
            onOpenAITutorWithContext={(cTitle, lTitle) => {
              setAiTutorContext({ courseTitle: cTitle, lessonTitle: lTitle });
              setIsAITutorOpen(true);
            }}
          />
        ) : !currentUser ? (
          activeTab === 'register' ? (
            <RegisterPage
              onRegister={(u) => {
                setCurrentUser(u);
                setActiveTab('dashboard');
              }}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          ) : (
            <LoginPage
              onLogin={(u) => {
                setCurrentUser(u);
                setActiveTab('dashboard');
              }}
              onSwitchToRegister={() => setActiveTab('register')}
            />
          )
        ) : (
          <>
            {activeTab === 'dashboard' && (
              currentUser.role === 'instructor' ? (
                <InstructorDashboard
                  currentUser={currentUser}
                  courses={courses}
                  assignments={assignments}
                  onCreateCourse={handleCreateCourse}
                  onGradeAssignment={handleGradeAssignment}
                />
              ) : currentUser.role === 'admin' ? (
                <AdminDashboard
                  currentUser={currentUser}
                  users={INITIAL_USERS}
                  courses={courses}
                  enrollments={enrollments}
                />
              ) : (
                <StudentDashboard
                  currentUser={currentUser}
                  courses={courses}
                  enrollments={enrollments}
                  certificates={certificates}
                  onEnroll={handleEnroll}
                  onOpenCoursePlayer={(c) => setSelectedCourseForPlayer(c)}
                  onViewCertificates={() => {}}
                  onBrowseCatalog={() => setActiveTab('catalog')}
                />
              )
            )}

            {activeTab === 'catalog' && (
              <CourseCatalog
                courses={courses}
                currentUser={currentUser}
                enrollments={enrollments}
                onEnroll={handleEnroll}
                onOpenCoursePlayer={(c) => setSelectedCourseForPlayer(c)}
              />
            )}

            {activeTab === 'my-learning' && (
              <StudentDashboard
                currentUser={currentUser}
                courses={courses}
                enrollments={enrollments}
                certificates={certificates}
                onEnroll={handleEnroll}
                onOpenCoursePlayer={(c) => setSelectedCourseForPlayer(c)}
                onViewCertificates={() => {}}
                onBrowseCatalog={() => setActiveTab('catalog')}
              />
            )}

            {activeTab === 'instructor-courses' && (
              <InstructorDashboard
                currentUser={currentUser}
                courses={courses}
                assignments={assignments}
                onCreateCourse={handleCreateCourse}
                onGradeAssignment={handleGradeAssignment}
              />
            )}

            {activeTab === 'admin-panel' && (
              <AdminDashboard
                currentUser={currentUser}
                users={INITIAL_USERS}
                courses={courses}
                enrollments={enrollments}
              />
            )}
          </>
        )}
      </main>

      {/* AI Tutor Chat Drawer */}
      <AITutorChat
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        initialCourseTitle={aiTutorContext.courseTitle}
        initialLessonTitle={aiTutorContext.lessonTitle}
      />

      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          course={courses.find(c => c.id === selectedCertificate.courseId)!}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
}
