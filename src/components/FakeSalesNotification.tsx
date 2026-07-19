'use client';

import { useEffect, useState } from 'react';

const buyers = [
  { name: 'Chinedu O.', city: 'Lagos State' },
  { name: 'Ibrahim S.', city: 'Kano State' },
  { name: 'Emeka A.', city: 'Rivers State' },
  { name: 'Tunde A.', city: 'Oyo State' },
  { name: 'Blessing E.', city: 'Delta State' },
  { name: 'Kabiru M.', city: 'Kaduna State' },
  { name: 'Festus O.', city: 'Edo State' },
  { name: 'Adewale B.', city: 'Osun State' },
  { name: 'Nnamdi C.', city: 'Anambra State' },
  { name: 'Yakubu D.', city: 'Plateau State' },
  { name: 'Seun F.', city: 'Ogun State' },
  { name: 'Chioma N.', city: 'Enugu State' },
];

const actions = [
  'just ordered the Thermal Fogging Machine!',
  'just placed an order!',
  'just requested delivery!',
  'just secured their order with Pay on Delivery!',
];

export default function FakeSalesNotification() {
  const [notification, setNotification] = useState<{ name: string; city: string; action: string } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let index = 0;

    const showNotification = () => {
      const buyer = buyers[index % buyers.length];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      setNotification({ name: buyer.name, city: buyer.city, action });
      setVisible(true);
      
      index++;

      setTimeout(() => {
        setVisible(false);
      }, 5000); // Hide after 5 seconds
    };

    // Initial delay before showing first notification
    const initialDelay = setTimeout(showNotification, 2500);
    
    // Interval for subsequent notifications
    const interval = setInterval(showNotification, 12000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  if (!notification) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 max-w-sm bg-white border-l-4 border-amber-500 rounded-r-lg shadow-2xl p-4 transition-all duration-500 ease-in-out transform ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </div>
        <p className="text-sm text-slate-800 m-0">
          <span className="font-bold">{notification.name}</span> from <span className="font-bold">{notification.city}</span> {notification.action}
        </p>
      </div>
    </div>
  );
}
