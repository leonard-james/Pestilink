"use client";

import Image from "next/image";
import Header from "../components/Header";

export default function AdminDashboard() {

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col">
      <Header hideAuth hideNav />
      
      <main className="relative z-10 flex-1 mt-16">
        <div className="relative min-h-screen">
          {/* Background image */}
          <Image
            src="/farm pic.jpg"
            alt="Admin Dashboard Background"
            fill
            className="object-cover"
            priority
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          {/* Content - Centered */}
          <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-center px-8">
            <div className="w-full max-w-5xl">
              {/* Title Box */}
              <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  Admin Dashboard
                </h1>
                <p className="mt-4 text-xl text-gray-300">
                  Manage your application with powerful admin tools
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Users Card */}
                <div className="bg-gray-600/30 p-6 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-green-400/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Total Users</h3>
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-400">1,234</p>
                  <p className="text-sm text-gray-400 mt-2">+12% from last month</p>
                </div>
                
                {/* Reports Card */}
                <div className="bg-gray-600/30 p-6 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-blue-400/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Reports</h3>
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">567</p>
                  <p className="text-sm text-gray-400 mt-2">+8 new today</p>
                </div>
                
                {/* Active Now Card */}
                <div className="bg-gray-600/30 p-6 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-yellow-400/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Active Now</h3>
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-yellow-400">42</p>
                  <p className="text-sm text-gray-400 mt-2">Currently online</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button 
                    className="p-5 bg-gray-600/30 hover:bg-gray-500/40 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-green-500/50 transition-all duration-300 text-left group"
                  >
                    <div className="p-3 bg-green-500/20 rounded-lg inline-block mb-3 group-hover:bg-green-500/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-lg mb-1">Manage Users</h3>
                    <p className="text-sm text-gray-400">View and manage user accounts</p>
                  </button>
                  
                  <button 
                    className="p-5 bg-gray-600/30 hover:bg-gray-500/40 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-blue-500/50 transition-all duration-300 text-left group"
                  >
                    <div className="p-3 bg-blue-500/20 rounded-lg inline-block mb-3 group-hover:bg-blue-500/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-lg mb-1">View Reports</h3>
                    <p className="text-sm text-gray-400">Review and manage reports</p>
                  </button>
                  
                  <button 
                    className="p-5 bg-gray-600/30 hover:bg-gray-500/40 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-purple-500/50 transition-all duration-300 text-left group"
                  >
                    <div className="p-3 bg-purple-500/20 rounded-lg inline-block mb-3 group-hover:bg-purple-500/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-lg mb-1">Settings</h3>
                    <p className="text-sm text-gray-400">Configure application settings</p>
                  </button>
                  
                  <button 
                    className="p-5 bg-gray-600/30 hover:bg-gray-500/40 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-pink-500/50 transition-all duration-300 text-left group"
                  >
                    <div className="p-3 bg-pink-500/20 rounded-lg inline-block mb-3 group-hover:bg-pink-500/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-lg mb-1">Analytics</h3>
                    <p className="text-sm text-gray-400">View usage statistics</p>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-600/30 rounded-xl backdrop-blur-sm border border-gray-500/20 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Recent Activity</h2>
                  <button className="text-sm text-gray-400 hover:text-white transition-colors">
                    View All →
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center p-4 bg-gray-500/10 rounded-lg hover:bg-gray-500/20 transition-colors">
                      <div className="p-2 bg-green-500/20 rounded-lg mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">New user registered</h4>
                        <p className="text-sm text-gray-400">2 hours ago</p>
                      </div>
                      <span className="text-sm text-gray-400">View</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom vignette */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
        </div>
      </main>
    </div>
  );
}
