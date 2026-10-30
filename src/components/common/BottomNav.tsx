import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { Home, Ticket, Trophy, User, Sparkles } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setUserSubView, isAdminMode } = useApp();

  if (isAdminMode) return null;

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode; isCenter?: boolean }[] = [
    {
      tab: 'HOME',
      label: 'HOME',
      icon: <Home className="w-5 h-5" />,
    },
    {
      tab: 'PLAY',
      label: 'PLAY',
      icon: <Sparkles className="w-5 h-5" />,
      isCenter: true,
    },
    {
      tab: 'TICKETS',
      label: 'TICKETS',
      icon: <Ticket className="w-5 h-5" />,
    },
    {
      tab: 'RESULTS',
      label: 'RESULTS',
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      tab: 'PROFILE',
      label: 'PROFILE',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#071833]/95 backdrop-blur-md border-t border-[#1E40AF]/50 shadow-2xl safe-area-pb">
      <div className="max-w-3xl mx-auto px-3 py-1 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;

          if (item.isCenter) {
            return (
              <button
                key={item.tab}
                onClick={() => {
                  setActiveTab(item.tab);
                }}
                className="relative -top-3.5 flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all transform group-active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] text-white shadow-[#1D4ED8]/60 scale-105 border-2 border-[#38BDF8]'
                      : 'bg-gradient-to-tr from-[#0D2E68] to-[#0A224E] text-[#93C5FD] border-2 border-[#1E40AF]/70 hover:border-[#38BDF8]'
                  }`}
                >
                  <Sparkles className="w-7 h-7 animate-pulse text-white" />
                </div>
                <span
                  className={`text-[10px] font-bold tracking-wider mt-1 ${
                    isActive ? 'text-[#38BDF8]' : 'text-blue-300/80'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.tab}
              onClick={() => {
                setActiveTab(item.tab);
                if (item.tab === 'HOME') {
                  setUserSubView('DASHBOARD');
                }
              }}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-[56px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-[#38BDF8]' : 'text-blue-300/60 hover:text-white'
              }`}
            >
              <div
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] font-semibold tracking-wider mt-1">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-0.5 shadow-sm shadow-[#38BDF8]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
