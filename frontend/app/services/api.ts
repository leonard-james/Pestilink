// API client configuration
// Ensure API URL doesn't have double /api
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE_URL = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;
const REQUEST_TIMEOUT_MS = 10000; // fail fast to avoid long hangs

async function fetchWithTimeout(resource: RequestInfo | URL, options: RequestInit = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(resource, { ...options, signal: controller.signal });
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection or backend availability.');
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'farmer' | 'company';
  company_name?: string;
  address?: string;
  contact_number?: string;
}

interface AuthResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
  token: string;
}

export const api = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    // Read response text once
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = 'Login failed';
      
      if (isJson) {
        try {
          const error = JSON.parse(responseText);
          errorMessage = error.errors?.email?.[0] || error.message || 'Login failed';
        } catch (e) {
          errorMessage = `Login failed: ${response.status} ${response.statusText}`;
        }
      } else {
        errorMessage = `Login failed: Server returned HTML instead of JSON (Status: ${response.status}). Make sure the backend server is running at ${API_BASE_URL}`;
      }
      
      throw new Error(errorMessage);
    }

    if (!isJson) {
      throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}. This usually means the backend server is not running or the API endpoint is incorrect.`);
    }

    try {
      return JSON.parse(responseText);
    } catch (jsonError) {
      throw new Error('Failed to parse JSON response from server');
    }
  },

  // Register user
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    // Read response text once
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      
      if (isJson) {
        try {
          const error = JSON.parse(responseText);
          errorMessage = error.errors?.email?.[0] || 
            error.errors?.password?.[0] || 
            error.errors?.name?.[0] ||
            error.message || 
            'Registration failed';
        } catch (e) {
          errorMessage = `Registration failed: ${response.status} ${response.statusText}`;
        }
      } else {
        errorMessage = `Registration failed: Server returned HTML instead of JSON (Status: ${response.status}). Make sure the backend server is running at ${API_BASE_URL}`;
      }
      
      throw new Error(errorMessage);
    }

    if (!isJson) {
      throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}. This usually means the backend server is not running or the API endpoint is incorrect.`);
    }

    try {
      return JSON.parse(responseText);
    } catch (jsonError) {
      throw new Error('Failed to parse JSON response from server');
    }
  },

  // Logout user
  async logout(token: string): Promise<{ message: string }> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  },

  // Get user profile
  async getProfile(token: string) {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },
};
