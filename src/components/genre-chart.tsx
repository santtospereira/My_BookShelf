'use client';

import {
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from "next-themes";

interface GenreChartProps {
  data: {
    name: string;
    total: number;
  }[];
}

export default function GenreChart({ data }: GenreChartProps) {
  const { theme } = useTheme();

  const genreNameColor = theme === 'dark' ? '#FFFFFF' : '#000000'; // Branco no Dark, Preto no Light

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-primary">Ranking de Gêneros</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Não há dados de gênero para exibir.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Ranking de Gêneros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              barCategoryGap="30%"
              margin={{
                top: 5,
                right: 20,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100} 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 12, fill: genreNameColor }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                contentStyle={{ 
                  background: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--border))' 
                }}
              />
              <Bar dataKey="total" name="Total de Livros" fill="var(--primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
