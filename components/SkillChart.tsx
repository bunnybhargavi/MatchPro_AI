
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface SkillChartProps {
  matchedCount: number;
  missingCount: number;
}

const SkillChart: React.FC<SkillChartProps> = ({ matchedCount, missingCount }) => {
  const data = [
    { name: 'Matched Skills', value: matchedCount, color: '#10b981' }, // emerald-500
    { name: 'Missing Skills', value: missingCount, color: '#f43f5e' }, // rose-500
  ];

  return (
    /* Adding min-width: 0 and ensuring block display helps Recharts calculate dimensions */
    <div className="w-full h-[300px] mt-4 min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            allowDecimals={false}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillChart;
