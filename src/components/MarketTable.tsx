"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useWeb3 } from '@/hooks/useWeb3';
import { web3Manager } from '@/services/web3Manager';
import { 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Copy,
  Loader2
} from 'lucide-react';

interface LoanMarket {
  id: string;
  contractAddress: string;
  borrowerAddress: string;
  tokenName: string;
  totalDebt: string;
  callerAPR: string; // SIM (Higher risk/reward)
  sellerPrize: string; // NÃO (Lower risk/reward)
  collateral: string;
  collateralScore: number;
  callsPercentage: number;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED';
}

type StatusFilter = 'ALL' | LoanMarket['status'];

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  
  return (
    <div 
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
          padding: '8px 12px',
          backgroundColor: '#151a21',
          border: '1px solid var(--card-border)',
          borderRadius: '8px',
          color: 'var(--text-secondary)',
          fontSize: '11px',
          width: '200px',
          zIndex: 1000,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          lineHeight: '1.4',
          textAlign: 'center'
        }}>
          {text}
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderColor: 'transparent transparent var(--card-border) transparent'
          }} />
        </div>
      )}
    </div>
  );
};

export const MarketTable: React.FC = () => {
  const { t } = useTranslation();
  const { copyToClipboard } = useWeb3();
  const router = useRouter();
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [loans, setLoans] = useState<LoanMarket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    async function loadLoans(isInitial = false) {
      if (isInitial) setIsLoading(true);
      try {
        const data = await web3Manager.fetchLoansFromLogs();
        setLoans(data as LoanMarket[]);
      } catch (err) {
        console.error("Erro ao carregar empréstimos dos logs", err);
      } finally {
        if (isInitial) setIsLoading(false);
      }
    }

    loadLoans(true);

    // Polling silencioso a cada 5s para capturar novos empréstimos
    const interval = setInterval(() => loadLoans(false), 5000);

    // Listener para forçar reload imediato após criação de empréstimo
    const onNewLoan = () => loadLoans();
    window.addEventListener('solvens:loanCreated', onNewLoan);

    return () => {
      clearInterval(interval);
      window.removeEventListener('solvens:loanCreated', onNewLoan);
    };
  }, []);

  const filteredData = useMemo(() => {
    if (filter === 'ALL') return loans;
    return loans.filter(item => item.status === filter);
  }, [filter, loans]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleFilterChange = (newFilter: StatusFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="glass" style={{
      width: '100%',
      padding: '24px',
      overflowX: 'auto',
      animation: 'fadeIn 0.6s ease forwards',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div className="flex-between" style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', color: 'var(--text-primary)' }}>{t('marketTable.title')}</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tag 
            label={t('marketTable.filterAll')} 
            active={filter === 'ALL'} 
            onClick={() => handleFilterChange('ALL')} 
          />
          <Tag 
            label={t('marketTable.filterActive')} 
            active={filter === 'ACTIVE'} 
            onClick={() => handleFilterChange('ACTIVE')} 
          />
          <Tag 
            label={t('marketTable.filterPending')} 
            active={filter === 'PENDING'} 
            onClick={() => handleFilterChange('PENDING')} 
          />
          <Tag 
            label={t('marketTable.filterCancelled')} 
            active={filter === 'CANCELLED'} 
            onClick={() => handleFilterChange('CANCELLED')} 
          />
        </div>
      </div>
      
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--card-border)' }}>
              <th style={TH_STYLE}>{t('marketTable.thContract')}</th>
              <th style={TH_STYLE}>{t('marketTable.thBorrower')}</th>
              <th style={{ ...TH_STYLE, minWidth: '120px' }}>{t('marketTable.thToken')}</th>
              <th style={TH_STYLE}>{t('marketTable.thTotalDebt')}</th>
              <th style={TH_STYLE}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {t('marketTable.thCallerAPR')}
                  <Tooltip text={t('marketTable.estimationNote')}>
                    <Info size={14} style={{ cursor: 'help', opacity: 0.6 }} />
                  </Tooltip>
                </div>
              </th>
              <th style={TH_STYLE}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {t('marketTable.thSellerPrize')}
                  <Tooltip text={t('marketTable.estimationNote')}>
                    <Info size={14} style={{ cursor: 'help', opacity: 0.6 }} />
                  </Tooltip>
                </div>
              </th>
              <th style={TH_STYLE}>{t('marketTable.thCollateral')}</th>
              <th style={TH_STYLE}>{t('marketTable.thCalls')}</th>
              <th style={TH_STYLE}>{t('marketTable.thStatus')}</th>
              <th style={{ ...TH_STYLE, textAlign: 'right' }}>{t('marketTable.thActions')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={10} style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Loader2 className="animate-spin" style={{ margin: '0 auto 16px', opacity: 0.5 }} size={32} />
                  <p>{t('common.connecting')}...</p>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p>Nenhum empréstimo encontrado para os filtros selecionados.</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
              <tr key={item.id} style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              onClick={() => router.push(`/loan/${item.contractAddress}`)}
              >
                <td style={TD_STYLE}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <code style={{ color: 'var(--primary)', fontSize: '13px', fontFamily: 'monospace' }}>
                      {shortenAddress(item.contractAddress)}
                    </code>
                    <button 
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(item.contractAddress); }}
                      style={{ color: 'var(--text-muted)', display: 'flex', padding: '4px', borderRadius: '4px', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      title="Copiar endereço completo"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </td>
                <td style={TD_STYLE}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <code style={{ color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'monospace' }}>
                      {shortenAddress(item.borrowerAddress)}
                    </code>
                    <button 
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(item.borrowerAddress); }}
                      style={{ color: 'var(--text-muted)', display: 'flex', padding: '4px', borderRadius: '4px', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      title="Copiar endereço completo"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </td>
                <td style={TD_STYLE}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>{item.tokenName}</div>
                </td>
                <td style={TD_STYLE}>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.totalDebt}</div>
                </td>
                <td style={TD_STYLE}>
                  <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{item.callerAPR}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('marketTable.estHighRisk')}</div>
                </td>
                <td style={TD_STYLE}>
                  <div style={{ color: 'var(--secondary)', fontWeight: 600 }}>{item.sellerPrize}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('marketTable.estLowRisk')}</div>
                </td>
                <td style={TD_STYLE}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '40px',
                      height: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px'
                    }}>
                      <div style={{
                        width: `${item.collateralScore}%`,
                        height: '100%',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '3px'
                      }} />
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.collateralScore}</span>
                  </div>
                </td>
                <td style={TD_STYLE}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '40px',
                      height: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px'
                    }}>
                      <div style={{
                        width: `${item.callsPercentage}%`,
                        height: '100%',
                        backgroundColor: item.callsPercentage > 85 ? 'var(--success)' : 'var(--warning)',
                        borderRadius: '3px'
                      }} />
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.callsPercentage}</span>
                  </div>
                </td>
                <td style={TD_STYLE}>
                  <StatusBadge status={item.status} />
                </td>
                <td style={{ ...TD_STYLE, textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ActionButton 
                      label={t('marketTable.investBtn')} 
                      type="primary" 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/loan/${item.contractAddress}`);
                      }}
                    />
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex-between" style={{ marginTop: '16px', padding: '0 12px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {t('marketTable.exhibiting')} <span style={{ color: 'var(--text-secondary)' }}>{paginatedData.length}</span> {t('marketTable.of')} <span style={{ color: 'var(--text-secondary)' }}>{filteredData.length}</span> {t('marketTable.contracts')}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            style={PAGINATION_BTN_STYLE(currentPage === 1)}
          >
            <ChevronLeft size={18} />
          </button>
          
          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
            {t('marketTable.page')} {currentPage} {t('marketTable.of')} {Math.max(1, totalPages)}
          </div>
          
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            style={PAGINATION_BTN_STYLE(currentPage === totalPages || totalPages === 0)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: LoanMarket['status'] }> = ({ status }) => {
  const { t } = useTranslation();
  const styles: Record<string, React.CSSProperties> = {
    ACTIVE: { backgroundColor: 'rgba(76, 175, 80, 0.12)', color: '#4caf50', borderColor: 'rgba(76, 175, 80, 0.2)' },
    PENDING: { backgroundColor: 'rgba(255, 152, 0, 0.12)', color: '#ff9800', borderColor: 'rgba(255, 152, 0, 0.2)' },
    CANCELLED: { backgroundColor: 'rgba(255, 82, 82, 0.12)', color: '#ff5252', borderColor: 'rgba(255, 82, 82, 0.2)' },
  };

  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: 600,
      border: '1px solid',
      ...styles[status]
    }}>
      {status === 'ACTIVE' ? t('marketTable.filterActive') : 
       status === 'PENDING' ? t('marketTable.filterPending') : 
       t('marketTable.filterCancelled')}
    </span>
  );
};

const ActionButton: React.FC<{ label: string; type: 'primary' | 'secondary'; onClick?: (e: React.MouseEvent) => void }> = ({ label, type, onClick }) => (
  <button 
    onClick={onClick}
    style={{
    padding: '10px 24px',
    borderRadius: '8px',
    backgroundColor: type === 'primary' ? 'var(--primary)' : 'rgba(182, 80, 158, 0.1)',
    color: type === 'primary' ? '#000' : 'var(--secondary)',
    border: `1px solid ${type === 'primary' ? 'var(--primary)' : 'rgba(182, 80, 158, 0.2)'}`,
    fontSize: '13px',
    fontWeight: 700,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: type === 'primary' ? '0 0 15px rgba(56, 251, 219, 0.2)' : 'none'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = type === 'primary' ? '0 4px 20px rgba(56, 251, 219, 0.4)' : '0 4px 12px rgba(182, 80, 158, 0.2)';
    if (type === 'primary') e.currentTarget.style.filter = 'brightness(1.1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = type === 'primary' ? '0 0 15px rgba(56, 251, 219, 0.2)' : 'none';
    if (type === 'primary') e.currentTarget.style.filter = 'brightness(1)';
  }}
  >
    {label}
  </button>
);

const Tag: React.FC<{ label: string; active?: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <span 
    onClick={onClick}
    style={{
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 500,
      backgroundColor: active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
      color: active ? '#000' : 'var(--text-secondary)',
      border: '1px solid var(--card-border)',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => !active && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
    onMouseLeave={(e) => !active && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
  >
    {label}
  </span>
);

const TH_STYLE: React.CSSProperties = {
  padding: '16px 10px',
  color: 'var(--text-muted)',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 600
};

const TD_STYLE: React.CSSProperties = {
  padding: '20px 10px',
  verticalAlign: 'middle'
};

const PAGINATION_BTN_STYLE = (disabled: boolean): React.CSSProperties => ({
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: disabled ? 'var(--text-muted)' : 'var(--text-primary)',
  border: '1px solid var(--card-border)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.4 : 1,
  transition: 'all 0.2s'
});
