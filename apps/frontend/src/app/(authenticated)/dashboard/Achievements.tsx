import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Award, CheckCircle2, Flame, Trophy, Code, Blocks } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Achievements() {
  // Mock data for achievements
  const achievements = [
    {
      id: 1,
      title: 'First Accepted',
      description: 'Solve your first problem',
      icon: CheckCircle2,
      color: 'text-[#4ebe96]',
      bg: 'bg-[#4ebe96]/10',
      unlocked: true,
    },
    {
      id: 2,
      title: '7-Day Streak',
      description: 'Submit solutions 7 days in a row',
      icon: Flame,
      color: 'text-[#ffa16c]',
      bg: 'bg-[#ffa16c]/10',
      unlocked: true,
    },
    {
      id: 3,
      title: '100 Problems',
      description: 'Successfully solve 100 problems',
      icon: Trophy,
      color: 'text-[#eb5757]',
      bg: 'bg-[#eb5757]/10',
      unlocked: false,
    },
    {
      id: 4,
      title: 'JS Master',
      description: 'Solve 50 JavaScript problems',
      icon: Code,
      color: 'text-[#f7df1e]',
      bg: 'bg-[#f7df1e]/10',
      unlocked: false,
    },
    {
      id: 5,
      title: 'React Explorer',
      description: 'Solve 20 React problems',
      icon: Blocks,
      color: 'text-[#61dafb]',
      bg: 'bg-[#61dafb]/10',
      unlocked: false,
    },
  ];

  return (
    <Card className="bg-[#191919] border-white/5 rounded-[16px] shadow-[0_0_44px_rgba(0,0,0,0.8)]">
      <CardHeader>
        <CardTitle className="text-base font-bold text-[#ffffff] flex items-center gap-2">
          <Award className="w-5 h-5 text-[#f7df1e]" /> Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-[12px] border transition-all duration-300 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-auto xl:flex-1',
                  achievement.unlocked
                    ? 'bg-[#131313] border-white/10 hover:border-white/20 hover:scale-105 cursor-pointer'
                    : 'bg-transparent border-white/5 opacity-50 grayscale cursor-not-allowed',
                )}
                title={achievement.description}
              >
                <div className={cn('p-3 rounded-xl shrink-0', achievement.bg, achievement.color)}>
                  <Icon size={24} className="stroke-[2]" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#ffffff] truncate">{achievement.title}</h4>
                  <p className="text-[11px] text-[#868f97] truncate">{achievement.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
