/**
 * API integration for DummyJSON Todos
 * Endpoint: https://dummyjson.com/todos
 * Natural variation between 4 to 6 tasks in each category (e.g. 6 To Do, 4 In Progress, 5 Completed).
 */

const TARGETS = {
  1: { todo: 6, 'in-progress': 4, completed: 5 }, // Evelyn: 6 To Do, 4 In Progress, 5 Completed
  2: { todo: 5, 'in-progress': 4, completed: 6 }, // Marcus: 5 To Do, 4 In Progress, 6 Completed
  3: { todo: 4, 'in-progress': 5, completed: 6 }, // Aria: 4 To Do, 5 In Progress, 6 Completed
  4: { todo: 6, 'in-progress': 5, completed: 4 }, // Julian: 6 To Do, 5 In Progress, 4 Completed
  5: { todo: 5, 'in-progress': 6, completed: 4 }, // Chloe: 5 To Do, 6 In Progress, 4 Completed
};

const FALLBACK_TODOS = [
  // Evelyn Reed (User 1): 6 To Do, 4 In Progress, 5 Completed (varied counts!)
  { id: 101, todo: "Finalize botanical design system token guidelines", completed: false, userId: 1, column: 'todo', priority: 'high', createdAt: '2026-10-08' },
  { id: 102, todo: "Review contrast ratio on Strawberry and Matcha buttons", completed: false, userId: 1, column: 'todo', priority: 'medium', createdAt: '2026-10-08' },
  { id: 103, todo: "Refine responsive card spacing on mobile screens", completed: false, userId: 1, column: 'todo', priority: 'low', createdAt: '2026-10-09' },
  { id: 104, todo: "Prepare presentation slides for Monday team sync", completed: false, userId: 1, column: 'todo', priority: 'medium', createdAt: '2026-10-09' },
  { id: 105, todo: "Plan quarterly design sprints with leads", completed: false, userId: 1, column: 'todo', priority: 'high', createdAt: '2026-10-09' },
  { id: 106, todo: "Select seasonal flower illustrations for icon set", completed: false, userId: 1, column: 'todo', priority: 'low', createdAt: '2026-10-09' },

  { id: 107, todo: "Audit customer feedback on the new task workflow", completed: false, userId: 1, column: 'in-progress', priority: 'high', createdAt: '2026-10-07' },
  { id: 108, todo: "Coordinate spring product roadmap with engineering", completed: false, userId: 1, column: 'in-progress', priority: 'medium', createdAt: '2026-10-07' },
  { id: 109, todo: "Draft quarterly goals for the design team", completed: false, userId: 1, column: 'in-progress', priority: 'low', createdAt: '2026-10-06' },
  { id: 110, todo: "Test drag and drop responsiveness on iPad", completed: false, userId: 1, column: 'in-progress', priority: 'medium', createdAt: '2026-10-06' },

  { id: 111, todo: "Set up design tokens in shared Tailwind CSS config", completed: true, userId: 1, column: 'completed', priority: 'medium', createdAt: '2026-10-05' },
  { id: 112, todo: "Verify WCAG 2.1 AAA color contrast on cards", completed: true, userId: 1, column: 'completed', priority: 'high', createdAt: '2026-10-05' },
  { id: 113, todo: "Release weekly release notes to team workspace", completed: true, userId: 1, column: 'completed', priority: 'low', createdAt: '2026-10-04' },
  { id: 114, todo: "Sip iced strawberry matcha latte & review metrics", completed: true, userId: 1, column: 'completed', priority: 'low', createdAt: '2026-10-04' },
  { id: 115, todo: "Organize project board milestones", completed: true, userId: 1, column: 'completed', priority: 'medium', createdAt: '2026-10-03' },

  // Marcus Vance (User 2): 5 To Do, 4 In Progress, 6 Completed
  { id: 201, todo: "Wireframe dark mode palette variations with Midnight Lagoon", completed: false, userId: 2, column: 'todo', priority: 'high', createdAt: '2026-10-08' },
  { id: 202, todo: "Optimize drag-and-drop animation frame rates", completed: false, userId: 2, column: 'todo', priority: 'medium', createdAt: '2026-10-09' },
  { id: 203, todo: "Prepare responsive viewport breakpoints", completed: false, userId: 2, column: 'todo', priority: 'low', createdAt: '2026-10-09' },
  { id: 204, todo: "Audit CSS bundle size for unused classes", completed: false, userId: 2, column: 'todo', priority: 'medium', createdAt: '2026-10-09' },
  { id: 205, todo: "Create high-res SVG export presets", completed: false, userId: 2, column: 'todo', priority: 'high', createdAt: '2026-10-09' },

  { id: 206, todo: "Publish component tokens to shared Figma library", completed: false, userId: 2, column: 'in-progress', priority: 'low', createdAt: '2026-10-07' },
  { id: 207, todo: "Implement smooth pill transition effects", completed: false, userId: 2, column: 'in-progress', priority: 'high', createdAt: '2026-10-07' },
  { id: 208, todo: "Test touch drag gesture on mobile devices", completed: false, userId: 2, column: 'in-progress', priority: 'medium', createdAt: '2026-10-07' },
  { id: 209, todo: "Clean up unused utility classes", completed: false, userId: 2, column: 'in-progress', priority: 'low', createdAt: '2026-10-06' },

  { id: 210, todo: "Refactor button hover states and focus rings", completed: true, userId: 2, column: 'completed', priority: 'high', createdAt: '2026-10-06' },
  { id: 211, todo: "Document typography scales for Fraunces", completed: true, userId: 2, column: 'completed', priority: 'low', createdAt: '2026-10-05' },
  { id: 212, todo: "Ship rounded-2xl modal redesign", completed: true, userId: 2, column: 'completed', priority: 'medium', createdAt: '2026-10-04' },
  { id: 213, todo: "Set up design review meeting notes", completed: true, userId: 2, column: 'completed', priority: 'low', createdAt: '2026-10-04' },
  { id: 214, todo: "Review accessible keyboard tab ordering", completed: true, userId: 2, column: 'completed', priority: 'high', createdAt: '2026-10-03' },
  { id: 215, todo: "Update team component changelog", completed: true, userId: 2, column: 'completed', priority: 'medium', createdAt: '2026-10-02' }
];

export async function fetchTodosFromApi() {
  try {
    const res = await fetch('https://dummyjson.com/todos?limit=100');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (!data.todos || !Array.isArray(data.todos)) {
      throw new Error('Invalid todos format from API');
    }

    // Track tasks per user and column according to varied TARGETS (e.g. 6 To Do, 4 In Progress, 5 Completed)
    const counts = {};
    for (let u = 1; u <= 5; u++) {
      counts[u] = { todo: 0, 'in-progress': 0, completed: 0 };
    }

    const priorities = ['low', 'medium', 'high'];
    const curatedTasks = [];

    for (let idx = 0; idx < data.todos.length; idx++) {
      const item = data.todos[idx];
      const personId = (idx % 5) + 1;
      const target = TARGETS[personId];
      const userCounts = counts[personId];

      // Determine initial candidate column based on item state
      let column = 'todo';
      if (item.completed) {
        column = 'completed';
      } else if (idx % 3 === 1) {
        column = 'in-progress';
      }

      // Check if target for candidate column is reached; if so, assign to another column with room
      if (userCounts[column] >= target[column]) {
        if (userCounts['todo'] < target['todo']) column = 'todo';
        else if (userCounts['in-progress'] < target['in-progress']) column = 'in-progress';
        else if (userCounts['completed'] < target['completed']) column = 'completed';
        else continue; // This person's target quotas are satisfied
      }

      userCounts[column]++;
      const priority = priorities[idx % 3];

      curatedTasks.push({
        id: item.id,
        todo: item.todo,
        completed: column === 'completed',
        userId: personId,
        column: column,
        priority: priority,
        createdAt: new Date(Date.now() - (idx * 86400000 * 0.3)).toISOString().split('T')[0]
      });
    }

    return curatedTasks;
  } catch (err) {
    console.warn('DummyJSON API fetch failed, loading botanical fallback data:', err);
    return FALLBACK_TODOS;
  }
}
