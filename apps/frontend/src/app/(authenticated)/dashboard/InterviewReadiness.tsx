import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

export function InterviewReadiness() {
  const readinessScore = 78; // Mock data
  const metrics = [
    { label: 'Accuracy', value: 85, color: 'bg-[#4ebe96]', text: 'text-[#4ebe96]' },
    { label: 'Consistency', value: 92, color: 'bg-[#479ffa]', text: 'text-[#479ffa]' },
    { label: 'Topic Coverage', value: 65, color: 'bg-[#ffa16c]', text: 'text-[#ffa16c]' },
    { label: 'Difficulty', value: 70, color: 'bg-[#9d72ff]', text: 'text-[#9d72ff]' },
  ];

  const data = [
    { name: 'Score', value: readinessScore },
    { name: 'Remaining', value: 100 - readinessScore },
  ];
  const COLORS = ['#7C3AED', 'rgba(255,255,255,0.05)'];

  return (
    <Card className="bg-[#191919] border-white/5 rounded-[16px] shadow-[0_0_44px_rgba(0,0,0,0.8)] overflow-hidden relative">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-base font-bold text-[#ffffff] flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#7C3AED]" /> Interview Readiness
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="w-32 h-32 relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={60}
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
              <span className="text-3xl font-bold text-[#ffffff] tracking-tight">
                {readinessScore}
              </span>
              <span className="text-[10px] text-[#868f97] uppercase tracking-wider font-semibold">
                Score
              </span>
            </div>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics.map((metric, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[12px] text-[#868f97]">{metric.label}</span>
                  <span className={cn('font-bold text-[12px]', metric.text)}>{metric.value}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-1000', metric.color)}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
