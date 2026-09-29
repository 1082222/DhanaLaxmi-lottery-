import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { Home, Ticket, Trophy, User, Sparkles } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setUserSubView, isAdminMode } = useApp();

  // If in admin portal, don't show the standard user bottom navigation (admin has its own tabs)
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#320912]/95 backdrop-blur-md border-t border-[#D4A017]/30 shadow-2xl safe-area-pb">
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
                      ? 'bg-gradient-to-tr from-[#D4A017] via-[#F5C542] to-[#FFF8E7] text-[#320912] shadow-[#D4A017]/50 scale-105 border-2 border-[#FFF8E7]'
                      : 'bg-gradient-to-tr from-[#6B1524] to-[#4A0E18] text-[#F8E7B0] border-2 border-[#D4A017]/60 hover:border-[#F5C542]'
                  }`}
                >
                  <Sparkles className="w-7 h-7 animate-pulse" />
                </div>
                <span
                  className={`text-[10px] font-bold tracking-wider mt-1 ${
                    isActive ? 'text-[#F5C542]' : 'text-[#F8E7B0]/70'
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
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-[56px] min-h-[44px] rounded-xl transition-all ${
                isActive ? 'text-[#F5C542]' : 'text-[#F8E7B0]/60 hover:text-[#FFF8E7]'
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
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4A017] mt-0.5 shadow-sm shadow-[#D4A017]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
