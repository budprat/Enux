// ============================================================================
// ENUX - Application Constants
// ============================================================================

// ----------------------------------------------------------------------------
// Route Constants
// ----------------------------------------------------------------------------

export const ROUTES = {
  // Public Routes
  HOME: '/',
  EXPLORE: '/explore',

  // Auth Routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // Protected Routes
  DASHBOARD: '/dashboard',

  // Repository Routes
  REPOSITORIES: '/repositories',
  REPOSITORY_DETAIL: '/repositories/:id',
  REPOSITORY_CREATE: '/repositories/new',
  REPOSITORY_EDIT: '/repositories/:id/edit',

  // Discovery Routes
  DISCOVERY: '/discovery',
  FRAMEWORK_DETAIL: '/frameworks/:id',

  // Collaboration Routes
  COLLABORATION: '/collaboration',
  COLLABORATION_DETAIL: '/collaboration/:id',

  // Proposals (Pull Requests)
  PROPOSALS: '/proposals',
  PROPOSAL_DETAIL: '/proposals/:id',
  PROPOSAL_CREATE: '/proposals/new',

  // Community Routes
  COMMUNITY: '/community',
  USER_PROFILE: '/users/:id',

  // AI Assistant
  AI_ASSISTANT: '/ai-assistant',

  // Settings
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_SECURITY: '/settings/security',

  // Other
  NOT_FOUND: '*',
} as const;

// Helper to generate dynamic routes
export const generateRoute = {
  repositoryDetail: (id: string) => `/repositories/${id}`,
  repositoryEdit: (id: string) => `/repositories/${id}/edit`,
  frameworkDetail: (id: string) => `/frameworks/${id}`,
  collaborationDetail: (id: string) => `/collaboration/${id}`,
  proposalDetail: (id: string) => `/proposals/${id}`,
  userProfile: (id: string) => `/users/${id}`,
};

// ----------------------------------------------------------------------------
// API Endpoints
// ----------------------------------------------------------------------------

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    PASSWORD_RESET_REQUEST: '/auth/password-reset/request',
    PASSWORD_RESET: '/auth/password-reset',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
  },

  // Repositories
  REPOSITORIES: '/repositories',

  // Frameworks
  FRAMEWORKS: '/frameworks',

  // Collaborations
  COLLABORATIONS: '/collaborations',

  // Proposals
  PROPOSALS: '/proposals',

  // Community
  COMMUNITY: {
    MEMBERS: '/community/members',
    OPPORTUNITIES: '/community/opportunities',
    FOLLOW: '/community/follow',
    CONNECTIONS: '/community/connections',
  },

  // AI
  AI: '/ai',

  // Activity
  ACTIVITY: '/activity',

  // Notifications
  NOTIFICATIONS: '/notifications',

  // Stats
  STATS: '/stats',

  // Profile
  PROFILE: '/profile',
} as const;

// ----------------------------------------------------------------------------
// Status Constants
// ----------------------------------------------------------------------------

export const REPOSITORY_STATUS = {
  ACTIVE: 'active',
  REVIEW: 'review',
  PENDING: 'pending',
  ARCHIVED: 'archived',
} as const;

export const PROPOSAL_STATUS = {
  DRAFT: 'draft',
  OPEN: 'open',
  REVIEW: 'review',
  APPROVED: 'approved',
  MERGED: 'merged',
  CLOSED: 'closed',
} as const;

export const COLLABORATION_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  COMPLETED: 'completed',
  PAUSED: 'paused',
} as const;

export const INVITE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
} as const;

export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  CHANGES_REQUESTED: 'changes_requested',
} as const;

// ----------------------------------------------------------------------------
// Priority Constants
// ----------------------------------------------------------------------------

export const PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

// ----------------------------------------------------------------------------
// Framework Categories
// ----------------------------------------------------------------------------

export const FRAMEWORK_CATEGORIES = [
  'Business Models',
  'Marketing',
  'Finance',
  'Operations',
  'Strategy',
  'Innovation',
  'Sales',
  'Product',
  'Analytics',
  'Growth',
] as const;

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
} as const;

// ----------------------------------------------------------------------------
// UI Constants
// ----------------------------------------------------------------------------

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const QUERY_STALE_TIME = {
  DEFAULT: 1000 * 60 * 5, // 5 minutes
  SHORT: 1000 * 60, // 1 minute
  LONG: 1000 * 60 * 30, // 30 minutes
  VERY_LONG: 1000 * 60 * 60, // 1 hour
} as const;

// ----------------------------------------------------------------------------
// Validation Constants
// ----------------------------------------------------------------------------

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 500,
  REPOSITORY_NAME_MIN_LENGTH: 3,
  REPOSITORY_NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const;

// ----------------------------------------------------------------------------
// Error Messages
// ----------------------------------------------------------------------------

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
} as const;
