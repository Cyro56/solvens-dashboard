import React from 'react';
import { ChevronRight } from 'lucide-react';

interface DocsCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const DocsCard: React.FC<DocsCardProps> = ({ icon, title, description, className }) => (
  <div className={`glass ${className}`} style={{
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.borderColor = 'var(--primary)';
    e.currentTarget.style.boxShadow = '0 8px 30px rgba(56, 251, 219, 0.1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.borderColor = 'var(--glass-border)';
    e.currentTarget.style.boxShadow = 'none';
  }}
  >
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      backgroundColor: 'rgba(56, 251, 219, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary)',
    }}>
      {icon}
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%' 
      }}>
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{title}</h3>
        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
      </div>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
        {description}
      </p>
    </div>
  </div>
);
