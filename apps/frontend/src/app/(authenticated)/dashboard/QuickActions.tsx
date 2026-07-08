import React from 'react';
import Link from 'next/link';
import { PlayCircle, Flame, Shuffle, Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function QuickActions() {
  const actions = [
    {
      label: 'Continue Practice',
      description: 'Resume from where you left off',
      icon: PlayCircle,
      href: '/problems',
      color: 'text-[#479ffa]',
      bg: 'bg-[#479ffa]/10',
      hoverBorder: 'hover:border-[#479ffa]/50',
    },
    {
      label: 'Daily Challenge',
      description: "Solve today's problem for extra XP",
      icon: Flame,
      href: '/problems?filter=daily',
      color: 'text-[#ffa16c]',
      bg: 'bg-[#ffa16c]/10',
      hoverBorder: 'hover:border-[#ffa16c]/50',
    },
    {
      label: 'Random Problem',
      description: 'Test yourself with a random challenge',
      icon: Shuffle,
      href: '/problems/random',
      color: 'text-[#4ebe96]',
      bg: 'bg-[#4ebe96]/10',
      hoverBorder: 'hover:border-[#4ebe96]/50',
    },
    {
      label: 'AI Assistant',
      description: 'Get help or mock an interview',
      icon: Bot,
      href: '/ai-assistant',
      color: 'text-[#9d72ff]',
      bg: 'bg-[#9d72ff]/10',
      hoverBorder: 'hover:border-[#9d72ff]/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <Link href={action.href} key={idx} className="block group">
            <Card
              className={`h-full bg-[#131313] border-white/5 rounded-[16px] shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 ${action.hoverBorder} hover:-translate-y-1`}
            >
              <CardContent className="p-5 flex flex-col items-start gap-4">
                <div
                  className={`p-3 rounded-2xl ${action.bg} ${action.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={24} className="stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#ffffff]">{action.label}</h3>
                  <p className="text-xs text-[#868f97]">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
