"use client";

import React from 'react';
import { TrendingUp, ShieldCheck, Activity } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export const StatsHeader: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '24px',
      marginBottom: '40px'
    }}>
      <StatCard 
        label={t('stats.totalMarketSize')} 
        value="$42.85B" 
        icon={<TrendingUp size={20} color="var(--primary)" />} 
        trend="+2.4%"
      />
      <StatCard 
        label={t('stats.totalLoans')} 
        value="$23.93B" 
        icon={<Activity size={20} color="var(--primary)" />} 
      />
    </div>
  );
};

const StatCard: React.FC<{ 
  label: string; 
  value: string; 
  icon: React.ReactNode; 
  trend?: string;
  description?: string;
}> = ({ label, value, icon, trend, description }) => (
  <div className="glass" style={{
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'transform 0.2s ease',
    cursor: 'default'
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
  >
    <div className="flex-between">
      <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'rgba(56, 251, 219, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
    </div>
    
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
      <h3 style={{ fontSize: '28px', color: 'var(--text-primary)' }}>{value}</h3>
      {trend && (
        <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>
          {trend}
        </span>
      )}
    </div>
    
    {description && (
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-4px' }}>
        {description}
      </p>
    )}
  </div>
);
