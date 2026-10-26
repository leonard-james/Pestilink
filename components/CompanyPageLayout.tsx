'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import DashboardSidebar from '@/app/components/DashboardSidebar';

interface CompanyPageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  headerRight?: ReactNode;
}

export default function CompanyPageLayout({ 
  children, 
  title, 
  description = '',
  headerRight = null 
}: CompanyPageLayoutProps) {
  return (
    <div className="min-h-screen w-full text-white flex flex-col relative overflow-hidden">
      <DashboardSidebar role="company" />
      
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/farm pic.jpg"
          alt="Farm background"
          fill
          className="object-cover object-center pointer-events-none"
          priority
          quality={100}
          style={{
            objectPosition: '50% 50%',
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-20 peer-hover:ml-64 transition-all duration-300 relative z-0">
        <div className="w-full max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 truncate">{title}</h1>
              {description && <p className="text-gray-300 text-sm md:text-base truncate">{description}</p>}
            </div>
            {headerRight && (
              <div className="w-full md:w-auto">
                {headerRight}
              </div>
            )}
          </div>
          
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
