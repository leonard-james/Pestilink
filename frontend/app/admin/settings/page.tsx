"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "../../components/DashboardSidebar";

interface Settings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  userRegistration: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  maxFileSize: number;
  sessionTimeout: number;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  logLevel: 'error' | 'warning' | 'info' | 'debug';
}

export default function AdminSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    siteName: "PestLink",
    siteDescription: "Connecting farmers with pest control services",
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
    maxFileSize: 10,
    sessionTimeout: 30,
    backupFrequency: 'daily',
    logLevel: 'info'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'system'>('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'security', name: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'notifications', name: 'Notifications', icon: 'M15 17h5l-5 5v-5zM4.868 12.683a1 1 0 011.414 0L8 14.4l1.718-1.717a1 1 0 011.414 1.414L9.414 15.814a1 1 0 01-1.414 0L6.282 14.097a1 1 0 010-1.414z' },
    { id: 'system', name: 'System', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-900 text-white flex">
        <DashboardSidebar role="admin" />
        <main className="relative z-10 flex-1 ml-20 peer-hover:ml-64 transition-all duration-300 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading settings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex">
      <DashboardSidebar role="admin" />
      
      <main className="relative z-10 flex-1 ml-20 peer-hover:ml-64 transition-all duration-300">
        <div className="relative min-h-screen">
          {/* Background image */}
          <Image
            src="/farm pic.jpg"
            alt="Admin Settings Background"
            fill
            className="object-cover"
            priority
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          {/* Content */}
          <div className="absolute inset-0 w-full px-4 py-8 overflow-auto">
            <div className="w-full max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    System Settings
                  </h1>
                  <p className="text-gray-400 mt-1">Configure application settings and preferences</p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button
                    onClick={() => router.push('/admin')}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    ← Back to Dashboard
                  </button>
                  <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Tabs */}
                <div className="lg:w-64">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                            : 'text-gray-300 hover:bg-gray-700/30 hover:text-white'
                        }`}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                        </svg>
                        {tab.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                    {activeTab === 'general' && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-4">General Settings</h2>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                          <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => handleInputChange('siteName', e.target.value)}
                            className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
                          <textarea
                            value={settings.siteDescription}
                            onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                            rows={3}
                            className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-300">Maintenance Mode</label>
                            <p className="text-xs text-gray-400">Temporarily disable site access for maintenance</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.maintenanceMode}
                              onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-300">User Registration</label>
                            <p className="text-xs text-gray-400">Allow new users to register accounts</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.userRegistration}
                              onChange={(e) => handleInputChange('userRegistration', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    )}

                    {activeTab === 'security' && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-4">Security Settings</h2>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
                          <input
                            type="number"
                            value={settings.sessionTimeout}
                            onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                            min="5"
                            max="120"
                            className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <p className="text-xs text-gray-400 mt-1">Users will be logged out after this period of inactivity</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Maximum File Upload Size (MB)</label>
                          <input
                            type="number"
                            value={settings.maxFileSize}
                            onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
                            min="1"
                            max="100"
                            className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                              <h3 className="text-sm font-medium text-yellow-400">Security Notice</h3>
                              <p className="text-xs text-yellow-300 mt-1">Changes to security settings will affect all users immediately.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'notifications' && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-300">Email Notifications</label>
                            <p className="text-xs text-gray-400">Send notifications via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.emailNotifications}
                              onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-300">SMS Notifications</label>
                            <p className="text-xs text-gray-400">Send notifications via SMS</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.smsNotifications}
                              onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    )}

                    {activeTab === 'system' && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-4">System Settings</h2>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Backup Frequency</label>
                          <select
                            value={settings.backupFrequency}
                            onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                            className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Log Level</label>
                          <select
                            value={settings.logLevel}
                            onChange={(e) => handleInputChange('logLevel', e.target.value)}
                            className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="error">Error</option>
                            <option value="warning">Warning</option>
                            <option value="info">Info</option>
                            <option value="debug">Debug</option>
                          </select>
                          <p className="text-xs text-gray-400 mt-1">Higher levels include more detailed logging</p>
                        </div>

                        <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <h3 className="text-sm font-medium text-blue-400">System Information</h3>
                              <p className="text-xs text-blue-300 mt-1">System version: 1.0.0 | Last backup: 2 hours ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}