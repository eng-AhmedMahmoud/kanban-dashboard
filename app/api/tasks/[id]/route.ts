import { NextRequest, NextResponse } from 'next/server';

// Import the shared tasks array from parent route
// Note: In production, this would be a database
const getTasksModule = async () => {
  const module = await import('../route');
  return module;
};

// GET /api/tasks/[id] - Get a single task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { tasks } = await getTasksModule() as any;
  const id = parseInt(params.id);
  const task = tasks.find((t: any) => t.id === id);

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json(task);
}

// PUT /api/tasks/[id] - Update a task (full replacement)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { tasks } = await getTasksModule() as any;
  const id = parseInt(params.id);
  const taskIndex = tasks.findIndex((t: any) => t.id === id);

  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updatedTask = {
      ...tasks[taskIndex],
      ...body,
      id, // Preserve the ID
      updatedAt: new Date().toISOString(),
    };
    tasks[taskIndex] = updatedTask;
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// PATCH /api/tasks/[id] - Partial update of a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { tasks } = await getTasksModule() as any;
  const id = parseInt(params.id);
  const taskIndex = tasks.findIndex((t: any) => t.id === id);

  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updatedTask = {
      ...tasks[taskIndex],
      ...body,
      id, // Preserve the ID
      updatedAt: new Date().toISOString(),
    };
    tasks[taskIndex] = updatedTask;
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const module = await getTasksModule() as any;
  const id = parseInt(params.id);
  const taskIndex = module.tasks.findIndex((t: any) => t.id === id);

  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  module.tasks.splice(taskIndex, 1);
  return NextResponse.json({}, { status: 200 });
}
