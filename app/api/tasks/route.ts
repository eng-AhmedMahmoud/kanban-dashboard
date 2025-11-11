import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for tasks (simulating a database)
// In production, this would be replaced with actual database calls
let tasks = [
  {
    id: 1,
    title: "Design homepage",
    description: "Include hero section with modern design and responsive layout",
    column: "backlog",
    createdAt: "2025-11-11T00:00:00.000Z",
    updatedAt: "2025-11-11T00:00:00.000Z"
  },
  {
    id: 2,
    title: "Set up authentication",
    description: "Implement user login and registration with JWT tokens",
    column: "backlog",
    createdAt: "2025-11-11T01:00:00.000Z",
    updatedAt: "2025-11-11T01:00:00.000Z"
  },
  {
    id: 3,
    title: "Create API endpoints",
    description: "Build RESTful API for user management and data operations",
    column: "in_progress",
    createdAt: "2025-11-11T02:00:00.000Z",
    updatedAt: "2025-11-11T02:00:00.000Z"
  },
  {
    id: 4,
    title: "Code review PR #123",
    description: "Review authentication implementation and provide feedback",
    column: "in_progress",
    createdAt: "2025-11-11T03:00:00.000Z",
    updatedAt: "2025-11-11T03:00:00.000Z"
  },
  {
    id: 5,
    title: "Update documentation",
    description: "Add API documentation and update README with latest changes",
    column: "review",
    createdAt: "2025-11-11T04:00:00.000Z",
    updatedAt: "2025-11-11T04:00:00.000Z"
  },
  {
    id: 6,
    title: "Set up project",
    description: "Initialize Next.js project with TypeScript and necessary dependencies",
    column: "review",
    createdAt: "2025-11-11T05:00:00.000Z",
    updatedAt: "2025-11-11T05:00:00.000Z"
  },
  {
    id: 7,
    title: "Install dependencies",
    description: "Install Redux, React Query, Material UI, and other required packages",
    column: "done",
    createdAt: "2025-11-11T06:00:00.000Z",
    updatedAt: "2025-11-11T06:00:00.000Z"
  },
  {
    id: 8,
    title: "Configure Tailwind CSS",
    description: "Set up Tailwind CSS with custom configuration for the project",
    column: "done",
    createdAt: "2025-11-11T07:00:00.000Z",
    updatedAt: "2025-11-11T07:00:00.000Z"
  },
  {
    id: 9,
    title: "Implement dark mode",
    description: "Add dark mode toggle with persistent user preference",
    column: "done",
    createdAt: "2025-11-11T08:00:00.000Z",
    updatedAt: "2025-11-11T08:00:00.000Z"
  },
  {
    id: 10,
    title: "Add unit tests",
    description: "Write unit tests for components and Redux slices",
    column: "done",
    createdAt: "2025-11-11T09:00:00.000Z",
    updatedAt: "2025-11-11T09:00:00.000Z"
  }
];

let nextId = 11;

// GET /api/tasks - Get all tasks
export async function GET() {
  return NextResponse.json(tasks);
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTask = {
      id: nextId++,
      title: body.title,
      description: body.description,
      column: body.column,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
