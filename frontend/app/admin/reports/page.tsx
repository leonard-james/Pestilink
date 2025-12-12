"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "../../components/DashboardSidebar";

interface Report {
  id: number;
  title: string;
  type: 'user_activity' | 'booking_stats' | 'revenue' | 'system_health';
  description: string;
  lastGenerated: string;
  status: 'ready' | 'generating' | 'error';
}

export default function AdminReports() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setReports([
        {
          id: 1,
          title: "User Activity Report",
          type: "user_activity",
          description: "Detailed analysis of user engagement and platform usage",
          lastGenerated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "ready"
        },
        {
          id: 2,
          title: "Booking Statistics",
          type: "booking_stats",
          description: "Service booking trends and completion rates",
          lastGenerated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: "ready"
        },
        {
          id: 3,
          title: "Revenue Analysis",
          type: "revenue",
          description: "Financial performance and revenue trends",
          lastGenerated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: "ready"
        },
        {
          id: 4,
          title: "System Health Report",
          type: "system_health",
          description: "Platform performance and technical metrics",
          lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "ready"
        }
      ]);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportId: number) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: 'generating' as const }
        : report
    ));

    // Simulate report generation
    setTimeout(() => {
      setReports(reports.map(report => 
        report.id === reportId 
          ? { 
              ...report, 
              status: 'ready' as const,
              lastGenerated: new Date().toISOString()
            }
          : report
      ));
    }, 3000);
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'user_activity':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'booking_stats':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'revenue':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'system_health':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex">
      <DashboardSidebar role="admin" />
      
      <main className="relative z-10 flex-1 ml-20 peer-hover:ml-64 transition-all duration-300">
        <div className="relative min-h-screen">
          {/* Background image */}
          <Image
            src="/farm pic.jpg"
            alt="Admin Reports Background"
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Reports & Analytics
                  </h1>
                  <p className="text-gray-400 mt-1">Generate and view system reports</p>
                </div>
                <button
                  onClick={() => router.push('/admin')}
                  className="mt-4 md:mt-0 text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  ← Back to Dashboard
                </button>
              </div>

              {/* Reports Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 animate-pulse">
                      <div className="h-6 bg-gray-600/30 rounded mb-4"></div>
                      <div className="h-4 bg-gray-600/20 rounded mb-2"></div>
                      <div className="h-4 bg-gray-600/20 rounded w-3/4"></div>
                    </div>
                  ))
                ) : (
                  reports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-400/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                          {getReportIcon(report.type)}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === 'ready' ? 'bg-green-900/50 text-green-300' :
                          report.status === 'generating' ? 'bg-yellow-900/50 text-yellow-300' :
                          'bg-red-900/50 text-red-300'
                        }`}>
                          {report.status === 'ready' ? 'Ready' :
                           report.status === 'generating' ? 'Generating...' : 'Error'}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2">{report.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{report.description}</p>
                      
                      <div className="text-xs text-gray-500 mb-4">
                        Last generated: {formatDate(report.lastGenerated)}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => generateReport(report.id)}
                          disabled={report.status === 'generating'}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                        >
                          {report.status === 'generating' ? 'Generating...' : 'Generate'}
                        </button>
                        <button
                          onClick={() => setSelectedReport(report)}
                          disabled={report.status !== 'ready'}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-bold mb-4">Quick Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">1,247</div>
                    <div className="text-sm text-gray-400">Total Reports Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">94.2%</div>
                    <div className="text-sm text-gray-400">System Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">₱127,450</div>
                    <div className="text-sm text-gray-400">Monthly Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">342</div>
                    <div className="text-sm text-gray-400">Active Services</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{selectedReport.title}</h2>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-8 text-center">
                  <div className="p-4 bg-blue-500/20 rounded-full inline-block mb-4">
                    {getReportIcon(selectedReport.type)}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{selectedReport.title}</h3>
                  <p className="text-gray-400 mb-6">{selectedReport.description}</p>
                  <p className="text-sm text-gray-500">
                    This is a placeholder for the actual report content. 
                    In a real implementation, this would show charts, tables, and detailed analytics.
                  </p>
                  <div className="mt-6 pt-6 border-t border-gray-600/50">
                    <p className="text-xs text-gray-500">
                      Generated: {formatDate(selectedReport.lastGenerated)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}