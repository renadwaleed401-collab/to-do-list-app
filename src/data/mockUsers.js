/**
 * Team roster for personal to-do boards
 */
export const PEOPLE = [
  { id: 1, name: 'Evelyn Reed', role: 'Product Lead', avatarColor: '#B46A72' },
  { id: 2, name: 'Marcus Vance', role: 'UI Architect', avatarColor: '#2D3A47' },
  { id: 3, name: 'Aria Montgomery', role: 'Frontend Engineer', avatarColor: '#A8B58A' },
  { id: 4, name: 'Julian Hayes', role: 'Backend Developer', avatarColor: '#A9B7C6' },
  { id: 5, name: 'Chloe Bennett', role: 'Content Strategist', avatarColor: '#B46A72' },
];

export const USERS_MAP = PEOPLE.reduce((acc, user) => {
  acc[user.id] = user;
  return acc;
}, {});

export function getUserInfo(userId) {
  if (USERS_MAP[userId]) {
    return USERS_MAP[userId];
  }
  return {
    id: userId,
    name: `User ${userId}`,
    role: 'Team Member',
    avatarColor: '#2D3A47'
  };
}

export function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
