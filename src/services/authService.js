import { storageService, KEYS } from './storageService';

export const SYSTEM_ADMIN_ID = 'sinai-system-admin';

const getUsers = () => {
  const users = storageService.getItem(KEYS.USERS, []);
  return Array.isArray(users) ? users : [];
};

const hasSystemAdmin = () => getUsers().some((user) => user.id === SYSTEM_ADMIN_ID);

const setupSystemAdmin = ({ name, email, password, confirmPassword }) => {
  const users = getUsers();
  if (users.some((user) => user.id === SYSTEM_ADMIN_ID)) {
    throw new Error('System Admin is already configured.');
  }

  const cleanName = name?.trim();
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanName) throw new Error('Full name is required.');
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Enter a valid email address.');
  if (!password || password.length < 8) throw new Error('Password must be at least 8 characters long.');
  if (password !== confirmPassword) throw new Error('Passwords do not match.');
  if (users.some((user) => user.email?.toLowerCase() === cleanEmail)) {
    throw new Error('An account with this email address already exists.');
  }

  const newAdmin = {
    id: SYSTEM_ADMIN_ID,
    name: cleanName,
    email: cleanEmail,
    password,
    role: 'admin',
    avatar: '',
    createdAt: new Date().toISOString(),
    protected: true,
  };
  users.push(newAdmin);
  storageService.setItem(KEYS.USERS, users);
  const { password: _password, ...currentUser } = newAdmin;
  storageService.setItem(KEYS.CURRENT_USER, currentUser);
  return currentUser;
};

export const userService = {
  delete: (userId) => {
    const users = getUsers();
    const target = users.find((user) => user.id === userId);
    if (userId === SYSTEM_ADMIN_ID || target?.protected) {
      throw new Error('لا يمكن حذف مدير النظام.');
    }
    const updated = users.filter((user) => user.id !== userId);
    storageService.setItem(KEYS.USERS, updated);
    return updated;
  }
};

export const authService = {
  hasSystemAdmin,
  setupSystemAdmin,
  getCurrentUser: () => {
    return storageService.getItem(KEYS.CURRENT_USER, null);
  },

  login: (email, password) => {
    const users = storageService.getItem(KEYS.USERS, []);
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const { password: _, ...userWithoutPassword } = user;
    storageService.setItem(KEYS.CURRENT_USER, userWithoutPassword);
    return userWithoutPassword;
  },

  register: (userData) => {
    const { name, email, phone, password, confirmPassword, role = 'customer' } = userData;
    if (!['customer', 'business_owner'].includes(role)) throw new Error('This account role cannot be created through public registration.');

    // JavaScript Validation (Section 22)
    if (!name || !name.trim()) throw new Error('Full name is required.');
    if (!email || !email.trim()) throw new Error('Email address is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('Please enter a valid email address.');
    if (!phone || !phone.trim()) throw new Error('Phone number is required.');
    if (!password) throw new Error('Password is required.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters long.');
    if (password !== confirmPassword) throw new Error('Passwords do not match.');

    const users = storageService.getItem(KEYS.USERS, []);
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `user-${crypto.randomUUID()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password,
      role: role,
      avatar: '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    storageService.setItem(KEYS.USERS, users);

    const { password: _, ...userWithoutPassword } = newUser;
    storageService.setItem(KEYS.CURRENT_USER, userWithoutPassword);
    return userWithoutPassword;
  },

  updateProfile: (updatedData) => {
    const currentUser = storageService.getItem(KEYS.CURRENT_USER, null);
    if (!currentUser) throw new Error('User not logged in.');

    const users = storageService.getItem(KEYS.USERS, []);
    const index = users.findIndex(u => u.id === currentUser.id);

    if (index === -1) throw new Error('User record not found.');

    const currentRecord = users[index];
    const allowedFields = ['name', 'email', 'phone', 'avatar', 'businessId', 'ownerId'];
    const safeUpdates = Object.fromEntries(
      Object.entries(updatedData).filter(([key]) => allowedFields.includes(key)),
    );
    const updatedUser = { ...currentRecord, ...safeUpdates };

    users[index] = updatedUser;
    storageService.setItem(KEYS.USERS, users);

    const { password: _, ...userWithoutPassword } = updatedUser;
    storageService.setItem(KEYS.CURRENT_USER, userWithoutPassword);
    return userWithoutPassword;
  },

  logout: () => {
    storageService.removeItem(KEYS.CURRENT_USER);
  }
};
