import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_COURSES, INITIAL_USERS, INITIAL_ENROLLMENTS, INITIAL_CERTIFICATES } from "./src/data/mockData";
import { Course, User, Enrollment, Certificate, Assignment } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "placeholder-key",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// In-memory data store seeded with mock data
let users: User[] = [...INITIAL_USERS];
let courses: Course[] = [...INITIAL_COURSES];
let enrollments: Enrollment[] = [...INITIAL_ENROLLMENTS];
let certificates: Certificate[] = [...INITIAL_CERTIFICATES];
let assignmentsList: Assignment[] = courses.map(c => c.assignment).filter(Boolean) as Assignment[];

// --- API Routes ---

// Auth: Register
app.post("/api/auth/register", (req, res) => {
  const { name, email, role, bio } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: "Name, email, and role are required." });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "User with this email already exists." });
  }

  const newUser: User = {
    id: `u-${Date.now()}`,
    name,
    email,
    role,
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
    bio: bio || `Passionate ${role} on the LMS platform.`,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  res.json({ user: newUser, token: `mock-token-${newUser.id}` });
});

// Auth: Login
app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "User not found. Please register first." });
  }
  res.json({ user, token: `mock-token-${user.id}` });
});

// Get all users (Admin)
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Courses: Get all
app.get("/api/courses", (req, res) => {
  res.json(courses);
});

// Courses: Create (Instructor / Admin)
app.post("/api/courses", (req, res) => {
  const { title, description, category, level, instructorId, instructorName, thumbnail, price, modules, quiz, assignment } = req.body;
  const newCourse: Course = {
    id: `c-${Date.now()}`,
    title,
    description,
    category: category || 'General',
    level: level || 'Beginner',
    instructorId: instructorId || 'u-instructor-1',
    instructorName: instructorName || 'Prof. Marcus Chen',
    thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
    price: price ? parseFloat(price) : 0,
    rating: 5.0,
    enrolledCount: 0,
    modules: modules || [],
    quiz,
    assignment: assignment ? { ...assignment, id: `asg-${Date.now()}` } : undefined,
    createdAt: new Date().toISOString()
  };

  courses.push(newCourse);
  if (newCourse.assignment) {
    assignmentsList.push(newCourse.assignment);
  }
  res.json(newCourse);
});

// Enrollments: Get by user
app.get("/api/enrollments/:userId", (req, res) => {
  const { userId } = req.params;
  const userEnrollments = enrollments.filter(e => e.userId === userId);
  res.json(userEnrollments);
});

// Enroll in course
app.post("/api/enrollments", (req, res) => {
  const { userId, courseId } = req.body;
  const existing = enrollments.find(e => e.userId === userId && e.courseId === courseId);
  if (existing) {
    return res.json(existing);
  }

  const newEnrollment: Enrollment = {
    id: `enr-${Date.now()}`,
    userId,
    courseId,
    progress: 0,
    completedLessons: [],
    assignmentSubmitted: false,
    isCompleted: false,
    enrolledAt: new Date().toISOString()
  };

  enrollments.push(newEnrollment);
  const course = courses.find(c => c.id === courseId);
  if (course) {
    course.enrolledCount += 1;
  }

  res.json(newEnrollment);
});

// Update lesson progress
app.post("/api/lessons/complete", (req, res) => {
  const { userId, courseId, lessonId } = req.body;
  let enrollment = enrollments.find(e => e.userId === userId && e.courseId === courseId);
  if (!enrollment) {
    enrollment = {
      id: `enr-${Date.now()}`,
      userId,
      courseId,
      progress: 0,
      completedLessons: [],
      assignmentSubmitted: false,
      isCompleted: false,
      enrolledAt: new Date().toISOString()
    };
    enrollments.push(enrollment);
  }

  if (!enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }

  // Calculate total lessons in course
  const course = courses.find(c => c.id === courseId);
  if (course) {
    let totalLessons = 0;
    course.modules.forEach(m => totalLessons += m.lessons.length);
    if (totalLessons > 0) {
      enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
      if (enrollment.progress >= 100) {
        enrollment.isCompleted = true;
      }
    }
  }

  res.json(enrollment);
});

// Submit Quiz
app.post("/api/quizzes/submit", (req, res) => {
  const { userId, courseId, score } = req.body;
  let enrollment = enrollments.find(e => e.userId === userId && e.courseId === courseId);
  if (enrollment) {
    enrollment.quizScore = score;
  }
  res.json({ success: true, enrollment });
});

// Submit Assignment
app.post("/api/assignments/submit", (req, res) => {
  const { assignmentId, studentId, studentName, content } = req.body;
  const assignment = assignmentsList.find(a => a.id === assignmentId) || courses.find(c => c.assignment?.id === assignmentId)?.assignment;
  
  if (assignment) {
    assignment.submission = {
      studentId,
      studentName,
      content,
      submittedAt: new Date().toISOString()
    };
    
    const enr = enrollments.find(e => e.userId === studentId);
    if (enr) {
      enr.assignmentSubmitted = true;
    }
  }

  res.json({ success: true, assignment });
});

// Grade Assignment (Instructor)
app.post("/api/assignments/grade", (req, res) => {
  const { assignmentId, grade, feedback } = req.body;
  const assignment = assignmentsList.find(a => a.id === assignmentId) || courses.find(c => c.assignment?.id === assignmentId)?.assignment;
  if (assignment && assignment.submission) {
    assignment.submission.grade = grade;
    assignment.submission.feedback = feedback;
  }
  res.json({ success: true, assignment });
});

// Generate Certificate
app.post("/api/certificates/generate", (req, res) => {
  const { userId, courseId } = req.body;
  const user = users.find(u => u.id === userId);
  const course = courses.find(c => c.id === courseId);

  if (!user || !course) {
    return res.status(404).json({ error: "User or course not found." });
  }

  let cert = certificates.find(c => c.userId === userId && c.courseId === courseId);
  if (!cert) {
    cert = {
      id: `cert-${Date.now()}`,
      userId,
      userName: user.name,
      courseId,
      courseTitle: course.title,
      instructorName: course.instructorName,
      issuedAt: new Date().toISOString()
    };
    certificates.push(cert);
  }

  res.json(cert);
});

// Get Certificates by user
app.get("/api/certificates/:userId", (req, res) => {
  const { userId } = req.params;
  const userCerts = certificates.filter(c => c.userId === userId);
  res.json(userCerts);
});

// Get all assignments
app.get("/api/assignments", (req, res) => {
  // Collect all assignments from courses
  const allAsgs: any[] = [];
  courses.forEach(c => {
    if (c.assignment) {
      allAsgs.push({ ...c.assignment, courseTitle: c.title, courseId: c.id });
    }
  });
  res.json(allAsgs);
});

// --- Gemini AI Endpoints ---

// AI Study Tutor
app.post("/api/gemini/tutor", async (req, res) => {
  const { prompt, courseTitle, lessonTitle } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are an expert AI tutor for the course "${courseTitle || 'General'}" and lesson "${lessonTitle || 'General'}". Answer the student's question clearly, pedagogically, and concisely with markdown formatting: ${prompt}`,
      config: {
        systemInstruction: "You are an encouraging, highly knowledgeable AI teaching assistant. Provide clear explanations, code snippets when relevant, and follow-up study suggestions.",
      }
    });

    res.json({ text: response.text || "I'm here to help you master this topic. Could you clarify your question?" });
  } catch (error: any) {
    console.error("Gemini AI Tutor error:", error);
    res.status(500).json({ error: "Failed to communicate with AI Tutor." });
  }
});

// AI Course Syllabus Generator
app.post("/api/gemini/syllabus", async (req, res) => {
  const { topic, level } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate a comprehensive course syllabus for topic: "${topic}" at level "${level || 'Intermediate'}". Include modules, lesson titles, and durations.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  lessons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        content: { type: Type.STRING }
                      },
                      required: ["title", "duration", "content"]
                    }
                  }
                },
                required: ["title", "lessons"]
              }
            }
          },
          required: ["title", "description", "category", "modules"]
        }
      }
    });

    const syllabus = JSON.parse(response.text || "{}");
    res.json(syllabus);
  } catch (error: any) {
    console.error("Gemini Syllabus error:", error);
    res.status(500).json({ error: "Failed to generate syllabus with AI." });
  }
});

// --- Vite Middleware / Static Serving ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LMS Server running on http://localhost:${PORT}`);
  });
}

startServer();
