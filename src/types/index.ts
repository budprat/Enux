// ============================================================================
// ENUX - Type Definitions
// ============================================================================

// ----------------------------------------------------------------------------
// User & Authentication Types
// ----------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  expertise: string[];
  reputation: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// ----------------------------------------------------------------------------
// Repository Types
// ----------------------------------------------------------------------------

export type RepositoryStatus = 'active' | 'review' | 'pending' | 'archived';
export type RepositoryVisibility = 'public' | 'private';

export interface Repository {
  id: string;
  name: string;
  description: string;
  content?: string;
  stars: number;
  forks: number;
  category: string;
  tags: string[];
  lastUpdated: string;
  status: RepositoryStatus;
  collaborators: Collaborator[];
  collaboratorCount: number;
  visibility: RepositoryVisibility;
  ownerId: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRepositoryInput {
  name: string;
  description: string;
  content?: string;
  category: string;
  tags: string[];
  visibility: RepositoryVisibility;
}

export interface UpdateRepositoryInput extends Partial<CreateRepositoryInput> {
  status?: RepositoryStatus;
}

export interface RepositoryFilters {
  status?: RepositoryStatus;
  visibility?: RepositoryVisibility;
  category?: string;
  search?: string;
  ownerId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'stars' | 'forks' | 'updatedAt' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ----------------------------------------------------------------------------
// Framework Types
// ----------------------------------------------------------------------------

export type FrameworkDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Framework {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  stars: number;
  forks: number;
  contributors: number;
  difficulty: FrameworkDifficulty;
  timeToImplement: string;
  author: User;
  authorId: string;
  growth?: string;
  matchScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FrameworkCategory {
  id: string;
  name: string;
  description: string;
  count: number;
  icon: string;
}

export interface FrameworkFilters {
  category?: string;
  difficulty?: FrameworkDifficulty;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'stars' | 'trending' | 'recent';
}

export interface AIRecommendation {
  id: string;
  frameworkId: string;
  framework: Framework;
  matchScore: number;
  reason: string;
  type: 'highly_recommended' | 'good_match' | 'community_favorite';
}

// ----------------------------------------------------------------------------
// Collaboration Types
// ----------------------------------------------------------------------------

export type CollaboratorStatus = 'online' | 'away' | 'offline';
export type CollaboratorRole = 'owner' | 'admin' | 'member' | 'viewer';
export type CollaborationStatus = 'active' | 'review' | 'completed' | 'archived';
export type InviteStatus = 'pending' | 'accepted' | 'declined';

export interface Collaborator {
  id: string;
  userId: string;
  user: User;
  role: CollaboratorRole;
  status: CollaboratorStatus;
  joinedAt: string;
}

export interface Collaboration {
  id: string;
  projectName: string;
  description: string;
  repositoryId?: string;
  repository?: Repository;
  collaborators: Collaborator[];
  status: CollaborationStatus;
  progress: number;
  lastActivity: string;
  nextMeeting?: string;
  ownerId: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationRequest {
  id: string;
  fromUserId: string;
  fromUser: User;
  toUserId: string;
  toUser: User;
  collaborationId?: string;
  collaboration?: Collaboration;
  repositoryId?: string;
  repository?: Repository;
  message: string;
  skills: string[];
  status: InviteStatus;
  mutualConnections: number;
  createdAt: string;
}

export interface CollaborationMessage {
  id: string;
  collaborationId: string;
  senderId: string;
  sender: User;
  content: string;
  type: 'message' | 'update' | 'question' | 'response';
  createdAt: string;
}

export interface CreateCollaborationInput {
  projectName: string;
  description: string;
  repositoryId?: string;
}

export interface SendCollaborationRequestInput {
  toUserId?: string;
  repositoryId?: string;
  collaborationId?: string;
  message: string;
  skills: string[];
}

// ----------------------------------------------------------------------------
// Proposal (Pull Request) Types
// ----------------------------------------------------------------------------

export type ProposalStatus = 'draft' | 'open' | 'review' | 'approved' | 'merged' | 'closed';
export type ProposalPriority = 'low' | 'medium' | 'high';
export type ReviewStatus = 'pending' | 'approved' | 'changes_requested';

export interface ProposalChanges {
  additions: number;
  deletions: number;
  files: number;
}

export interface ProposalReviewer {
  id: string;
  userId: string;
  user: User;
  status: ReviewStatus;
  comment?: string;
  reviewedAt?: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  content: string;
  repositoryId: string;
  repository: Repository;
  authorId: string;
  author: User;
  status: ProposalStatus;
  priority: ProposalPriority;
  changes: ProposalChanges;
  reviewers: ProposalReviewer[];
  comments: number;
  hasConflicts: boolean;
  labels: string[];
  progress?: number;
  lastSaved?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalComment {
  id: string;
  proposalId: string;
  authorId: string;
  author: User;
  content: string;
  lineNumber?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProposalInput {
  title: string;
  description: string;
  content: string;
  repositoryId: string;
  priority: ProposalPriority;
  labels: string[];
  reviewerIds: string[];
}

export interface UpdateProposalInput extends Partial<CreateProposalInput> {
  status?: ProposalStatus;
}

export interface SubmitReviewInput {
  proposalId: string;
  status: ReviewStatus;
  comment?: string;
}

export interface ProposalFilters {
  status?: ProposalStatus;
  priority?: ProposalPriority;
  repositoryId?: string;
  authorId?: string;
  reviewerId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ----------------------------------------------------------------------------
// Community Types
// ----------------------------------------------------------------------------

export interface CommunityMember extends User {
  repositories: number;
  followers: number;
  following: number;
  matchScore?: number;
  isOnline: boolean;
  recentActivity?: string;
  isFollowing?: boolean;
}

export type OpportunityType = 'seeking' | 'offering';

export interface CollaborationOpportunity {
  id: string;
  title: string;
  type: OpportunityType;
  description: string;
  skills: string[];
  authorId: string;
  author: User;
  responses: number;
  matchScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityFilters {
  search?: string;
  expertise?: string[];
  location?: string;
  isOnline?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'reputation' | 'followers' | 'matchScore';
}

export interface OpportunityFilters {
  type?: OpportunityType;
  skills?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

// ----------------------------------------------------------------------------
// AI Assistant Types
// ----------------------------------------------------------------------------

export type AIMessageRole = 'user' | 'assistant' | 'system';

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  suggestions?: string[];
  timestamp: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export type AIRecommendationType = 'template' | 'optimization' | 'collaboration' | 'insight';

export interface AIAssistantRecommendation {
  id: string;
  type: AIRecommendationType;
  title: string;
  description: string;
  confidence: number;
  action: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface SendAIMessageInput {
  conversationId?: string;
  message: string;
  context?: string;
}

export interface AIResponse {
  conversationId: string;
  message: AIMessage;
  recommendations?: AIAssistantRecommendation[];
}

// ----------------------------------------------------------------------------
// Activity Types
// ----------------------------------------------------------------------------

export type ActivityType = 'commit' | 'star' | 'fork' | 'collaboration' | 'comment' | 'review' | 'merge' | 'create' | 'update';
export type ActivityStatus = 'success' | 'pending' | 'warning' | 'error';

export interface Activity {
  id: string;
  type: ActivityType;
  status: ActivityStatus;
  title: string;
  description: string;
  userId: string;
  user: User;
  repositoryId?: string;
  repository?: Repository;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ActivityFilters {
  type?: ActivityType;
  userId?: string;
  repositoryId?: string;
  page?: number;
  limit?: number;
}

// ----------------------------------------------------------------------------
// Notification Types
// ----------------------------------------------------------------------------

export type NotificationType = 'collaboration_request' | 'proposal_review' | 'comment' | 'mention' | 'star' | 'fork' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// Stats Types
// ----------------------------------------------------------------------------

export interface UserStats {
  repositories: number;
  stars: number;
  collaborators: number;
  activeProjects: number;
  totalViews: number;
  totalForks: number;
}

export interface DashboardStats extends UserStats {
  recentActivity: Activity[];
  trendingFrameworks: Framework[];
  recommendedCollaborators: CommunityMember[];
}

// ----------------------------------------------------------------------------
// API Response Types
// ----------------------------------------------------------------------------

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
