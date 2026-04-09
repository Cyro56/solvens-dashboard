import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  ChevronRight, 
  HelpCircle,
  Zap,
  Lock,
  Globe,
  HandCoins
} from 'lucide-react';

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      backgroundColor: active ? 'rgba(56, 251, 219, 0.1)' : 'transparent',
      color: active ? 'var(--primary)' : 'var(--text-secondary)',
      fontSize: '14px',
      fontWeight: active ? 600 : 400,
      transition: 'all 0.2s',
      marginBottom: '4px'
    }}
    onMouseEnter={(e) => !active && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
    onMouseLeave={(e) => !active && (e.currentTarget.style.backgroundColor = 'transparent')}
  >
    {icon && <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>}
    <span>{label}</span>
    {!active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.3 }} />}
  </div>
);

const SectionTitle: React.FC<{ label: string }> = ({ label }) => (
  <div style={{
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: '24px',
    marginBottom: '12px',
    paddingLeft: '12px'
  }}>
    {label}
  </div>
);

export type DocSection = 'overview' | 'solvens101' | 'markets' | 'loans' | 'callersSellers' | 'collateral' | 'audits';

interface DocsSidebarProps {
  activeSection: DocSection;
  onSelect: (section: DocSection) => void;
}

export const DocsSidebar: React.FC<DocsSidebarProps> = ({ activeSection, onSelect }) => {
  const { t } = useTranslation();
  
  return (
    <aside style={{
      width: '280px',
      height: 'calc(100vh - 80px)',
      position: 'sticky',
      top: '80px',
      padding: '20px',
      borderRight: '1px solid var(--card-border)',
      overflowY: 'auto'
    }}>
      <SectionTitle label={t('sidebar.intro')} />
      <SidebarItem 
        icon={<BookOpen size={18} />} 
        label={t('sidebar.overview')} 
        active={activeSection === 'overview'} 
        onClick={() => onSelect('overview')}
      />
      
      <SectionTitle label={t('sidebar.protocol')} />
      <SidebarItem 
        icon={<HandCoins size={18} />} 
        label={t('sidebar.loans')} 
        active={activeSection === 'loans'} 
        onClick={() => onSelect('loans')}
      />
      <SidebarItem 
        icon={<Layers size={18} />} 
        label={t('sidebar.markets')} 
        active={activeSection === 'markets'} 
        onClick={() => onSelect('markets')}
      />
      <SidebarItem 
        icon={<Zap size={18} />} 
        label={t('sidebar.callersSellers')} 
        active={activeSection === 'callersSellers'} 
        onClick={() => onSelect('callersSellers')}
      />
      <SidebarItem 
        icon={<Lock size={18} />} 
        label={t('sidebar.collateral')} 
        active={activeSection === 'collateral'} 
        onClick={() => onSelect('collateral')}
      />
      
      <SectionTitle label={t('sidebar.security')} />
      <SidebarItem 
        icon={<ShieldCheck size={18} />} 
        label={t('sidebar.audits')} 
        active={activeSection === 'audits'} 
        onClick={() => onSelect('audits')}
      />
    </aside>
  );
};
