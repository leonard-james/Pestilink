'use client';

import { usePathname } from 'next/navigation';
import { useNotifications } from '@/contexts/NotificationContext';

const pageTitles: Record<string, string> = {
  '/dashboard/farmer/orders': 'My Orders',
  '/company/orders': 'Bookings',
};

export default function PageHeader() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  
  const title = pageTitles[pathname] || '';
  const showNotification = pathname === '/dashboard/farmer/orders' || pathname === '/company/orders';

  if (!title) return null;

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white">
        {title}
      </h1>
    </div>
  );
}
