"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

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

const MOCK_DATA: LoanMarket[] = [
  { id: '1', contractAddress: '0x789b...a12c', borrowerAddress: '0x123a...f456', tokenName: 'sUSDC-Debt', totalDebt: '450,000 USDC', callerAPR: '32.50%', sellerPrize: '8.20%', collateral: '280,000 USDC', collateralScore: 62, callsPercentage: 92, status: 'ACTIVE' },
  { id: '2', contractAddress: '0x456d...e789', borrowerAddress: '0x987b...c321', tokenName: 'sUSDC-Debt', totalDebt: '1,200,000 USDC', callerAPR: '28.15%', sellerPrize: '6.45%', collateral: '950,000 USDC', collateralScore: 79, callsPercentage: 88, status: 'PENDING' },
  { id: '3', contractAddress: '0x123f...b012', borrowerAddress: '0x555c...d888', tokenName: 'sUSDC-Debt', totalDebt: '250,000 USDC', callerAPR: '42.00%', sellerPrize: '12.30%', collateral: '180,000 USDC', collateralScore: 72, callsPercentage: 75, status: 'ACTIVE' },
  { id: '4', contractAddress: '0xbcde...f999', borrowerAddress: '0xaaa1...e111', tokenName: 'sUSDC-Debt', totalDebt: '85,000 USDC', callerAPR: '38.60%', sellerPrize: '9.80%', collateral: '45,000 USDC', collateralScore: 53, callsPercentage: 81, status: 'CANCELLED' },
  { id: '5', contractAddress: '0x222a...b333', borrowerAddress: '0xccc4...d555', tokenName: 'sUSDC-Debt', totalDebt: '150,000 USDC', callerAPR: '35.20%', sellerPrize: '7.80%', collateral: '110,000 USDC', collateralScore: 73, callsPercentage: 90, status: 'ACTIVE' },
  { id: '6', contractAddress: '0xdee3...a111', borrowerAddress: '0xbbb2...c999', tokenName: 'sUSDC-Debt', totalDebt: '90,000 USDC', callerAPR: '31.10%', sellerPrize: '6.50%', collateral: '65,000 USDC', collateralScore: 72, callsPercentage: 85, status: 'PENDING' },
  { id: '7', contractAddress: '0x999f...c222', borrowerAddress: '0x111d...e333', tokenName: 'sUSDC-Debt', totalDebt: '2,500,000 USDC', callerAPR: '24.50%', sellerPrize: '5.20%', collateral: '1.8M USDC', collateralScore: 72, callsPercentage: 94, status: 'ACTIVE' },
  { id: '8', contractAddress: '0x777b...d000', borrowerAddress: '0x444a...b555', tokenName: 'sUSDC-Debt', totalDebt: '320,000 USDC', callerAPR: '45.00%', sellerPrize: '14.20%', collateral: '210,000 USDC', collateralScore: 65, callsPercentage: 72, status: 'PENDING' },
  { id: '9', contractAddress: '0x333e...f444', borrowerAddress: '0x777c...d111', tokenName: 'sUSDC-Debt', totalDebt: '1,000,000 USDC', callerAPR: '26.80%', sellerPrize: '4.95%', collateral: '750,000 USDC', collateralScore: 75, callsPercentage: 96, status: 'ACTIVE' },
  { id: '10', contractAddress: '0xaaa2...c444', borrowerAddress: '0x888b...e999', tokenName: 'sUSDC-Debt', totalDebt: '45,000 USDC', callerAPR: '48.20%', sellerPrize: '15.50%', collateral: '25,000 USDC', collateralScore: 55, callsPercentage: 68, status: 'CANCELLED' },
  { id: '11', contractAddress: '0x555d...e666', borrowerAddress: '0x999a...b111', tokenName: 'sUSDC-Debt', totalDebt: '210,000 USDC', callerAPR: '39.40%', sellerPrize: '10.20%', collateral: '145,000 USDC', collateralScore: 69, callsPercentage: 83, status: 'ACTIVE' },
  { id: '12', contractAddress: '0xbbbc...d555', borrowerAddress: '0x222c...e888', tokenName: 'sUSDC-Debt', totalDebt: '600,000 USDC', callerAPR: '34.80%', sellerPrize: '8.40%', collateral: '420,000 USDC', collateralScore: 70, callsPercentage: 89, status: 'PENDING' },
];

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
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = useMemo(() => {
    if (filter === 'ALL') return MOCK_DATA;
    return MOCK_DATA.filter(item => item.status === filter);
  }, [filter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleFilterChange = (newFilter: StatusFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <div className="glass" style={{
      width: '100%',
      padding: '32px',
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
            {paginatedData.map((item) => (
              <tr key={item.id} style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={TD_STYLE}>
                  <code style={{ color: 'var(--primary)', fontSize: '13px' }}>{item.contractAddress}</code>
                </td>
                <td style={TD_STYLE}>
                  <code style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{item.borrowerAddress}</code>
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
                    <ActionButton label={t('marketTable.investBtn')} type="primary" />
                  </div>
                </td>
              </tr>
            ))}
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

const ActionButton: React.FC<{ label: string; type: 'primary' | 'secondary' }> = ({ label, type }) => (
  <button style={{
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
  padding: '16px 12px',
  color: 'var(--text-muted)',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 600
};

const TD_STYLE: React.CSSProperties = {
  padding: '20px 12px',
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
