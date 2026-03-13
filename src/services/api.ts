// Backend routes are under /api (e.g. /api/auth/register, /api/projects). Ensure base URL ends with /api.
const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = raw.endsWith('/api') ? raw : raw.replace(/\/?$/, '/api');

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: { email: string; password: string; name: string; role: string }) {
    const response = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(data: { email: string; password: string }) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.setToken(null);
  }

  // Project endpoints
  async getProjects(filters?: {
    search?: string;
    duration?: string;
    workType?: string;
    techStack?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString();
    return this.request<{ projects: any[]; pagination: any }>(
      `/projects${query ? `?${query}` : ''}`
    );
  }

  async getProject(id: string) {
    return this.request<{ project: any }>(`/projects/${id}`);
  }

  async createProject(data: {
    title: string;
    description: string;
    deadline: string;
    duration: string;
    workType: string[];
    budget?: string;
    techStack: { name: string; proficiency: number }[];
  }) {
    return this.request<{ project: any }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: Partial<{
    title: string;
    description: string;
    deadline: string;
    duration: string;
    workType: string[];
    budget?: string;
    techStack: { name: string; proficiency: number }[];
    status: string;
  }>) {
    return this.request<{ project: any }>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async applyToProject(projectId: string, message?: string) {
    return this.request<{ application: any }>(`/projects/${projectId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Profile endpoints
  async getProfile(userId: string) {
    return this.request<{ profile: any }>(`/profiles/${userId}`);
  }

  async getMyProfile() {
    return this.request<{ profile: any }>('/profiles/me/profile');
  }

  async updateProfile(userId: string, data: {
    fullName?: string;
    location?: string;
    bio?: string;
    website?: string;
    avatarUrl?: string;
    skills?: { name: string; proficiency: number }[];
  }) {
    return this.request<{ profile: any }>(`/profiles/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Chat endpoints
  async getChannels() {
    return this.request<{ channels: any[] }>('/chat/channels');
  }

  async getChannelMessages(channelId: string, limit?: number, before?: string) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (before) params.append('before', before);
    const query = params.toString();
    return this.request<{ messages: any[] }>(
      `/chat/channels/${channelId}/messages${query ? `?${query}` : ''}`
    );
  }

  async sendMessage(channelId: string, content: string) {
    return this.request<{ message: any }>(`/chat/channels/${channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Roadmap endpoints
  async generateRoadmap(skill: string) {
    return this.request<{ roadmap: any }>('/roadmap/generate', {
      method: 'POST',
      body: JSON.stringify({ skill }),
    });
  }

  async getRoadmaps() {
    return this.request<{ roadmaps: any[] }>('/roadmap');
  }

  async updateRoadmap(roadmapId: string, modules: any) {
    return this.request<{ roadmap: any }>(`/roadmap/${roadmapId}`, {
      method: 'PATCH',
      body: JSON.stringify({ modules }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);

