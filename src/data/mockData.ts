import { Course, User, Enrollment, Certificate } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    name: 'Dr. Eleanor Vance',
    email: 'admin@lms.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: 'Chief Academic Officer & Platform Administrator',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'u-instructor-1',
    name: 'Prof. Marcus Chen',
    email: 'marcus.chen@lms.edu',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Professor of Computer Science & Full-Stack Architecture',
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 'u-instructor-2',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@lms.edu',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    bio: 'Lead Data Scientist & AI Research Fellow',
    createdAt: '2026-01-20T10:15:00Z',
  },
  {
    id: 'u-student-1',
    name: 'Alex Rivera',
    email: 'student@lms.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    bio: 'Aspiring Full-Stack Software Engineer & UI Enthusiast',
    createdAt: '2026-02-01T12:00:00Z',
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c-1',
    title: 'Full-Stack Web Development Masterclass 2026',
    description: 'Master modern web development from scratch. Build production-grade full-stack apps with React 19, TypeScript, Node.js, Express, and PostgreSQL.',
    category: 'Computer Science',
    level: 'Intermediate',
    instructorId: 'u-instructor-1',
    instructorName: 'Prof. Marcus Chen',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
    price: 99.99,
    rating: 4.9,
    enrolledCount: 1420,
    createdAt: '2026-01-18T10:00:00Z',
    modules: [
      {
        id: 'm-1-1',
        title: 'Module 1: Advanced TypeScript & React Patterns',
        lessons: [
          { id: 'l-1-1-1', title: 'Welcome & Course Architecture', duration: '12 min', content: 'In this introductory lesson, we review the course roadmap, configure strict TypeScript guidelines, and establish optimal React component structures.', isCompleted: false },
          { id: 'l-1-1-2', title: 'Custom Hooks & State Management', duration: '25 min', content: 'Deep dive into building reusable custom hooks, optimizing re-renders with useCallback and useMemo, and managing asynchronous state cleanly.', isCompleted: false },
          { id: 'l-1-1-3', title: 'Tailwind CSS v4 & Responsive Layouts', duration: '18 min', content: 'Mastering modern styling workflows with Tailwind CSS utility classes, container queries, and fluid typography.', isCompleted: false },
        ]
      },
      {
        id: 'm-1-2',
        title: 'Module 2: Backend REST APIs & Node.js',
        lessons: [
          { id: 'l-1-2-1', title: 'Express Server Setup & Middleware', duration: '20 min', content: 'Setting up robust Express servers with TypeScript, CORS, JSON parsing, error handling middlewares, and request logging.', isCompleted: false },
          { id: 'l-1-2-2', title: 'Database Integration & ORMs', duration: '30 min', content: 'Connecting relational databases securely, writing migrations, and executing type-safe queries.', isCompleted: false },
        ]
      }
    ],
    quiz: {
      id: 'q-1',
      title: 'Full-Stack Architecture & React Final Quiz',
      questions: [
        {
          id: 'qq-1',
          question: 'Which hook is recommended for memoizing expensive calculations in React?',
          options: ['useEffect', 'useMemo', 'useState', 'useCallback'],
          correctAnswer: 1,
          explanation: 'useMemo caches the result of a calculation between re-renders.'
        },
        {
          id: 'qq-2',
          question: 'What is the standard port used by default in our container reverse proxy setup?',
          options: ['3000', '5000', '8080', '4200'],
          correctAnswer: 0,
          explanation: 'Port 3000 is the hardcoded externally accessible port in our container runtime.'
        }
      ]
    },
    assignment: {
      id: 'asg-1',
      title: 'Build a Full-Stack Task Manager',
      description: 'Create a fully functional task manager with backend API endpoints and a React frontend supporting filtering and local storage synchronization.',
      dueDate: '2026-08-15T23:59:59Z',
      points: 100
    }
  },
  {
    id: 'c-2',
    title: 'Data Science & Machine Learning with Python',
    description: 'Comprehensive introduction to data analysis, pandas, scikit-learn, neural networks, and generative AI integrations.',
    category: 'Data Science',
    level: 'Advanced',
    instructorId: 'u-instructor-2',
    instructorName: 'Dr. Sarah Jenkins',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
    price: 129.99,
    rating: 4.8,
    enrolledCount: 980,
    createdAt: '2026-01-22T14:00:00Z',
    modules: [
      {
        id: 'm-2-1',
        title: 'Module 1: Pandas & NumPy Foundations',
        lessons: [
          { id: 'l-2-1-1', title: 'Data Wrangling with Pandas DataFrames', duration: '22 min', content: 'Cleaning datasets, handling missing values, grouping, and merging multi-source CSV data.', isCompleted: false },
          { id: 'l-2-1-2', title: 'Data Visualization with Matplotlib & Seaborn', duration: '30 min', content: 'Creating publication-ready charts, heatmaps, and correlation matrices.', isCompleted: false },
        ]
      }
    ],
    quiz: {
      id: 'q-2',
      title: 'Data Science Fundamentals Quiz',
      questions: [
        {
          id: 'qq-2-1',
          question: 'Which Python library is primarily used for tabular data manipulation?',
          options: ['NumPy', 'Pandas', 'Matplotlib', 'Requests'],
          correctAnswer: 1,
          explanation: 'Pandas provides high-performance, easy-to-use data structures and data analysis tools.'
        }
      ]
    },
    assignment: {
      id: 'asg-2',
      title: 'Predictive Housing Price Model',
      description: 'Build a linear regression model using scikit-learn to predict housing prices based on square footage and neighborhood features.',
      dueDate: '2026-08-20T23:59:59Z',
      points: 100
    }
  },
  {
    id: 'c-3',
    title: 'UX/UI Product Design Systems & Figma',
    description: 'Learn human-centered design principles, accessible color tokens, responsive wireframing, and scalable design systems.',
    category: 'Design',
    level: 'Beginner',
    instructorId: 'u-instructor-1',
    instructorName: 'Prof. Marcus Chen',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600',
    price: 79.99,
    rating: 4.9,
    enrolledCount: 2150,
    createdAt: '2026-02-05T11:00:00Z',
    modules: [
      {
        id: 'm-3-1',
        title: 'Module 1: Design Tokens & Typography',
        lessons: [
          { id: 'l-3-1-1', title: 'Mathematical Spacing & Type Scales', duration: '15 min', content: 'Understanding modular type scales, 8pt grid systems, and WCAG contrast guidelines.', isCompleted: false }
        ]
      }
    ]
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr-1',
    userId: 'u-student-1',
    courseId: 'c-1',
    progress: 33,
    completedLessons: ['l-1-1-1'],
    quizScore: undefined,
    assignmentSubmitted: false,
    isCompleted: false,
    enrolledAt: '2026-02-10T14:20:00Z'
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [];
