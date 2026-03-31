'use client';

import { BarChart2, TrendingUp, Users, BookCopy } from 'lucide-react';

const MONTHLY = [
  { month:'Oct', borrows:310, returns:290 },
  { month:'Nov', borrows:285, returns:270 },
  { month:'Dec', borrows:195, returns:220 },
  { month:'Jan', borrows:340, returns:310 },
  { month:'Feb', borrows:380, returns:355 },
  { month:'Mar', borrows:420, returns:390 },
];

const GENRES = [
  { genre:'Fiction',     count:3840, pct:88 },
  { genre:'Non-Fiction', count:2910, pct:67 },
  { genre:'Science',     count:2140, pct:49 },
  { genre:'History',     count:1870, pct:43 },
  { genre:'Technology',  count:1620, pct:37 },
  { genre:'Philosophy',  count:1040, pct:24 },
];

const maxBorrows = Math.max(...MONTHLY.map(m => m.borrows));

export default function AnalyticsPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <div className="mb-6 animate-fade-up">
        <h1 className="font-display text-3xl font-bold text-primary-950">Analytics</h1>
        <p className="mt-1 text-sm text-primary-800/50">Library usage trends and insights</p>
      </div>

      {/* Mini KPI row */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 animate-fade-up" style={{ animationDelay:'80ms' }}>
        {[
          { label:'Avg. Daily Borrows',  value:'42',   icon:BookCopy,  color:'text-primary' },
          { label:'Return Rate',          value:'94.2%', icon:TrendingUp, color:'text-secondary' },
          { label:'New Users / Month',    value:'203',  icon:Users,     color:'text-amber-700' },
        ].map((k, i) => (
          <div key={i} className="rounded-2xl border border-primary/[0.1] bg-card-bg p-5 shadow-brand-sm">
            <k.icon size={18} strokeWidth={1.75} className={`${k.color} mb-3 opacity-70`} />
            <p className={`font-display text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs font-medium text-primary-800/50 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly borrow/return bar chart */}
        <div className="rounded-2xl border border-primary/[0.1] bg-card-bg shadow-brand-sm overflow-hidden animate-fade-up" style={{ animationDelay:'140ms' }}>
          <div className="border-b border-primary/[0.08] px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-primary-950">Monthly Activity</h2>
            <p className="text-xs text-primary-800/45 mt-0.5">Borrows vs returns over 6 months</p>
          </div>
          <div className="p-5">
            <div className="flex items-end gap-3 h-40">
              {MONTHLY.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-0.5" style={{ height:'120px' }}>
                    <div
                      className="flex-1 rounded-t-md bg-gradient-to-t from-primary to-primary-400 transition-all duration-700"
                      style={{ height:`${(m.borrows/maxBorrows)*100}%`, transitionDelay:`${i*80}ms` }}
                    />
                    <div
                      className="flex-1 rounded-t-md bg-gradient-to-t from-secondary to-secondary-400 opacity-60 transition-all duration-700"
                      style={{ height:`${(m.returns/maxBorrows)*100}%`, transitionDelay:`${i*80+40}ms` }}
                    />
                  </div>
                  <span className="text-[10px] text-primary-800/40 font-medium">{m.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-primary-800/50"><span className="h-2.5 w-2.5 rounded-sm bg-primary" />Borrows</div>
              <div className="flex items-center gap-1.5 text-xs text-primary-800/50"><span className="h-2.5 w-2.5 rounded-sm bg-secondary opacity-60" />Returns</div>
            </div>
          </div>
        </div>

        {/* Genre breakdown */}
        <div className="rounded-2xl border border-primary/[0.1] bg-card-bg shadow-brand-sm overflow-hidden animate-fade-up" style={{ animationDelay:'200ms' }}>
          <div className="border-b border-primary/[0.08] px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-primary-950">Borrows by Genre</h2>
            <p className="text-xs text-primary-800/45 mt-0.5">All-time breakdown</p>
          </div>
          <div className="p-5 space-y-4">
            {GENRES.map((g, i) => (
              <div key={i} className="animate-fade-up" style={{ animationDelay:`${300+i*60}ms` }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-primary-900">{g.genre}</span>
                  <span className="text-sm font-bold text-primary">{g.count.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-primary/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-400 transition-all duration-700"
                    style={{ width:`${g.pct}%`, transitionDelay:`${400+i*60}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration note */}
      <div className="mt-6 rounded-xl border border-primary/[0.1] bg-primary/[0.03] px-5 py-4 animate-fade-up" style={{ animationDelay:'400ms' }}>
        <div className="flex items-start gap-3">
          <BarChart2 size={16} className="text-primary/50 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-primary-800/55 leading-relaxed">
            <strong className="text-primary/70">API integration point:</strong> Replace mock data with{' '}
            <code className="font-mono text-[11px] bg-primary/8 px-1.5 py-0.5 rounded">GET /api/analytics/summary</code> and{' '}
            <code className="font-mono text-[11px] bg-primary/8 px-1.5 py-0.5 rounded">GET /api/analytics/monthly</code>.
            Consider <a href="https://recharts.org" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary-600">Recharts</a> or{' '}
            <a href="https://nivo.rocks" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary-600">Nivo</a> for production charts.
          </p>
        </div>
      </div>
    </div>
  );
}