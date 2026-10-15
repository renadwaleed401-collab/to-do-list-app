/**
 * API integration for DummyJSON Todos
 * ALL tasks are strictly for User 1
 * Distribution: 6 To Do, 4 In Progress, 5 Completed (15 tasks total, 4-6 per category)
 */

export const FALLBACK_TODOS = [
  // User 1 tasks (15 tasks: 6 To Do, 4 In Progress, 5 Completed)
  { id: 101, todo: "Finalize botanical design system token guidelines", completed: false, userId: 1, column: 'todo', priority: 'high', createdAt: '2026-10-08' },
  { id: 102, todo: "Review contrast ratio on Strawberry and Matcha buttons", completed: false, userId: 1, column: 'todo', priority: 'medium', createdAt: '2026-10-08' },
  { id: 103, todo: "Refine responsive card spacing on mobile screens", completed: false, userId: 1, column: 'todo', priority: 'low', createdAt: '2026-10-09' },
  { id: 104, todo: "Prepare presentation slides for Monday sync", completed: false, userId: 1, column: 'todo', priority: 'medium', createdAt: '2026-10-09' },
  { id: 105, todo: "Plan quarterly sprints and deliverables", completed: false, userId: 1, column: 'todo', priority: 'high', createdAt: '2026-10-09' },
  { id: 106, todo: "Select seasonal flower illustrations for icon set", completed: false, userId: 1, column: 'todo', priority: 'low', createdAt: '2026-10-09' },

  { id: 107, todo: "Audit customer feedback on the new task workflow", completed: false, userId: 1, column: 'in-progress', priority: 'high', createdAt: '2026-10-07' },
  { id: 108, todo: "Coordinate spring product roadmap with engineering", completed: false, userId: 1, column: 'in-progress', priority: 'medium', createdAt: '2026-10-07' },
  { id: 109, todo: "Draft goals for next milestone", completed: false, userId: 1, column: 'in-progress', priority: 'low', createdAt: '2026-10-06' },
  { id: 110, todo: "Test drag and drop responsiveness on iPad", completed: false, userId: 1, column: 'in-progress', priority: 'medium', createdAt: '2026-10-06' },

  { id: 111, todo: "Set up design tokens in shared Tailwind CSS config", completed: true, userId: 1, column: 'completed', priority: 'medium', createdAt: '2026-10-05' },
  { id: 112, todo: "Verify WCAG 2.1 AAA color contrast on cards", completed: true, userId: 1, column: 'completed', priority: 'high', createdAt: '2026-10-05' },
  { id: 113, todo: "Release weekly release notes to workspace", completed: true, userId: 1, column: 'completed', priority: 'low', createdAt: '2026-10-04' },
  { id: 114, todo: "Sip iced strawberry matcha latte & review metrics", completed: true, userId: 1, column: 'completed', priority: 'low', createdAt: '2026-10-04' },
  { id: 115, todo: "Organize project board milestones", completed: true, userId: 1, column: 'completed', priority: 'medium', createdAt: '2026-10-03' }
];

export async function fetchTodosFromApi() {
  try {
    const res = await fetch(`https://dummyjson.com/todos?limit=15`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (!data.todos || !Array.isArray(data.todos) || data.todos.length === 0) {
      throw new Error('Invalid todos format from API');
    }

    const priorities = ['low', 'medium', 'high'];
    
    // Distribute 15 tasks strictly for User 1:
    // 6 To Do, 4 In Progress, 5 Completed
    return data.todos.slice(0, 15).map((item, idx) => {
      let column = 'todo';
      let completed = false;

      if (idx < 6) {
        column = 'todo';
        completed = false;
      } else if (idx < 10) {
        column = 'in-progress';
        completed = false;
      } else {
        column = 'completed';
        completed = true;
      }

      return {
        id: item.id,
        todo: item.todo,
        completed: completed,
        userId: 1, // All tasks belong strictly to User 1
        column: column,
        priority: priorities[idx % 3],
        createdAt: new Date(Date.now() - (idx * 86400000 * 0.25)).toISOString().split('T')[0]
      };
    });
  } catch (err) {
    console.warn('DummyJSON API fetch failed, loading fallback data for User 1:', err);
    return FALLBACK_TODOS;
  }
}