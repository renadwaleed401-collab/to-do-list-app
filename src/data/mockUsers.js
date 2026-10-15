/**
 * Dynamic users roster for personal to-do boards
 * Defaults to User 1 with the ability to add users dynamically
 */
export const DEFAULT_USERS = [
  { id: 1, name: 'User 1', role: 'Workspace 1', avatarColor: '#838F58' },
];

export const AVATAR_COLORS = [
  '#838F58', // Matcha
  '#C96B7F', // Strawberry
  '#A8B58A', // Sage
  '#B46A72', // Rosewood
  '#535E32', // Deep Matcha
  '#8E364A', // Deep Berry
];

export function getUserInfo(userId, customUsers = null) {
  const list = customUsers || DEFAULT_USERS;
  const found = list.find(u => u.id === Number(userId));
  if (found) return found;

  const num = Number(userId) || 1;
  return {
    id: num,
    name: `User ${num}`,
    role: `Workspace ${num}`,
    avatarColor: AVATAR_COLORS[(num - 1) % AVATAR_COLORS.length]
  };
}

export function getInitials(name) {
  if (!name) return 'U1';
  const match = name.trim().match(/^User\s*(\d+)$/i);
  if (match) {
    return `U${match[1]}`;
  }
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}