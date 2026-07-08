import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Target, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function WeeklyGoal() {
  const goal = 10;
  const current = 2; // Mock data
  const remaining = Math.max(0, goal - current);

  const data = [
    { name: 'Completed', value: current },
    { name: 'Remaining', value: remaining },
  ];
  const COLORS = ['#4ebe96', 'rgba(255,255,255,0.05)'];

  return (
    <Card className="bg-[#191919] border-white/5 rounded-[16px] shadow-[0_0_44px_rgba(0,0,0,0.8)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-[#4ebe96]/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-base font-bold text-[#ffffff] flex items-center gap-2">
          <Target className="w-5 h-5 text-[#4ebe96]" /> Weekly Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-3xl font-bold tracking-tight text-[#ffffff]">
              {current} <span className="text-lg text-[#868f97] font-normal">/ {goal}</span>
            </p>
            <p className="text-[11px] text-[#868f97]">
              {remaining > 0 ? `Solve ${remaining} more this week` : 'Goal completed!'}
            </p>
          </div>
          <div className="w-20 h-20 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={36}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-sm font-bold text-[#ffffff]">
                {Math.round((current / goal) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/problems?filter=weekly"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'w-full rounded-xl bg-transparent border-white/10 text-[#ffffff] hover:bg-white/5 hover:text-[#ffffff] transition-all flex items-center justify-center gap-2',
          )}
        >
          View Goal
          <ChevronRight size={14} />
        </Link>
      </CardContent>
    </Card>
  );
}
