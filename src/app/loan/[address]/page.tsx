"use client";

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { InvestModal } from '@/components/InvestModal';
import { useTranslation } from '@/hooks/useTranslation';
import { useWeb3 } from '@/hooks/useWeb3';
import { web3Manager } from '@/services/web3Manager';
import Web3 from 'web3';
import { 
  ArrowLeft, 
  Wallet, 
  ShieldCheck, 
  Coins, 
  FileText, 
  Activity, 
  TrendingUp, 
  Info,
  ChevronRight,
  Clock,
  CircleDollarSign,
  Copy
} from 'lucide-react';

// Reusing mock data logic
const MOCK_DATA = [
  { id: '1', contractAddress: '0x789b...a12c', borrowerAddress: '0x123a...f456', tokenName: 'sUSDC-Debt', totalDebt: '450,000 USDC', callerAPR: '32.50%', sellerPrize: '8.20%', collateral: '280,000 USDC', collateralScore: 62, callsPercentage: 92, status: 'ACTIVE' as const },
  { id: '2', contractAddress: '0x456d...e789', borrowerAddress: '0x987b...c321', tokenName: 'sUSDC-Debt', totalDebt: '1,200,000 USDC', callerAPR: '28.15%', sellerPrize: '6.45%', collateral: '950,000 USDC', collateralScore: 79, callsPercentage: 88, status: 'PENDING' as const },
  { id: '3', contractAddress: '0x123f...b012', borrowerAddress: '0x555c...d888', tokenName: 'sUSDC-Debt', totalDebt: '250,000 USDC', callerAPR: '42.00%', sellerPrize: '12.30%', collateral: '180,000 USDC', collateralScore: 72, callsPercentage: 75, status: 'ACTIVE' as const },
  { id: '4', contractAddress: '0xbcde...f999', borrowerAddress: '0xaaa1...e111', tokenName: 'sUSDC-Debt', totalDebt: '85,000 USDC', callerAPR: '38.60%', sellerPrize: '9.80%', collateral: '45,000 USDC', collateralScore: 53, callsPercentage: 81, status: 'CANCELLED' as const },
  { id: '5', contractAddress: '0x222a...b333', borrowerAddress: '0xccc4...d555', tokenName: 'sUSDC-Debt', totalDebt: '150,000 USDC', callerAPR: '35.20%', sellerPrize: '7.80%', collateral: '110,000 USDC', collateralScore: 73, callsPercentage: 90, status: 'ACTIVE' as const },
];

export default function LoanDetailPage() {
  const { address } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { copyToClipboard, account } = useWeb3();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [realLoanData, setRealLoanData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Busca dados reais do cofre on-chain
  React.useEffect(() => {
    async function sync() {
      setIsLoading(true);
      try {
        const state = await web3Manager.getVaultState(address as string);
        if (state) {
          // Determina a unidade baseada na rede
          const chainId = (web3Manager.getState().chainId || '').toLowerCase();
          const isLocalOrAmoy = chainId === '0x7a69' || chainId === '0x13882' || chainId === '31337' || chainId === '80002';
          const unit = isLocalOrAmoy ? 'ether' : 'mwei';

          const debtNum = parseFloat(Web3.utils.fromWei(state.targetAmount, unit));
          const collateralNum = parseFloat(Web3.utils.fromWei(state.collateralAmount, unit));
          const callerAmount = parseFloat(Web3.utils.fromWei(state.totalCallerInv, unit));

          setRealLoanData({
            totalDebt: `${debtNum.toLocaleString('en-US')} USDC`,
            collateral: `${collateralNum.toLocaleString('en-US')} USDC`,
            callerAPR: (state.apr / 100).toFixed(2) + '%',
            callsPercentage: debtNum > 0 ? Math.round((callerAmount / debtNum) * 100) : 0,
            status: 'PENDING' // Por enquanto pendente, até implementarmos lógica de status no contrato
          });
        }
      } catch (e) {
        console.error("Erro ao carregar detalhes do empréstimo:", e);
      } finally {
        setIsLoading(false);
      }
    }
    sync();
  }, [address]);

  const loan = useMemo(() => {
    const found = MOCK_DATA.find(item => item.contractAddress === address);
    
    // Merge dos dados reais sobre os fakes ou fallback
    const base = found || { 
      id: address as string, 
      contractAddress: address as string, 
      borrowerAddress: '0x39fd...2266', // Fallback visual
      tokenName: 'sUSDC-Debt', 
      totalDebt: 'Solicitado...', 
      callerAPR: '--%', 
      sellerPrize: '8.00%', 
      collateral: '-- USDC', 
      collateralScore: 75, 
      callsPercentage: 0, 
      status: 'PENDING' as const 
    };

    return realLoanData ? { ...base, ...realLoanData } : base;
  }, [address, realLoanData]);

  const annualInterest = useMemo(() => {
    if (loan.callerAPR === '--%') return '--%';
    return loan.callerAPR;
  }, [loan.callerAPR]);

  // Subcomponents moved inside to access copyToClipboard
  function DetailItem({ label, value, isAddress = false, isStatus = false }: { label: string, value: string, isAddress?: boolean, isStatus?: boolean }) {
    return (
      <div className="flex-between">
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        {isStatus ? (
          <StatusBadge status={value as any} />
        ) : isAddress ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <code style={{ fontSize: '13px', color: 'var(--primary)' }}>{value}</code>
            <button 
              onClick={() => copyToClipboard(value)}
              style={{ color: 'var(--text-muted)', display: 'flex', padding: '4px', borderRadius: '4px', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <Copy size={12} />
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>{value}</span>
        )}
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>
      <Header />
      
      <div className="container" style={{ padding: '40px 2rem', flex: 1, maxWidth: '1200px' }}>
        {/* Breadcrumbs / Back Button */}
        <button 
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            marginBottom: '32px',
            transition: 'color 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft size={18} />
          {t('loanDetail.backToMarkets')}
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
          {/* Main Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Title Section */}
            <div className="glass" style={{ padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h1 style={{ fontSize: '28px', color: 'var(--text-primary)', margin: 0 }}>{loan.tokenName}</h1>
                  <StatusBadge status={loan.status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                  <FileText size={16} />
                  <code>{loan.contractAddress}</code>
                  <button 
                    onClick={() => copyToClipboard(loan.contractAddress)}
                    style={{ color: 'var(--text-muted)', display: 'flex', padding: '4px', borderRadius: '4px', transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {t('loanDetail.annualInterest')}
                </div>
                <div style={{ fontSize: '24px', color: 'var(--primary)', fontWeight: 700 }}>{annualInterest}</div>
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              {/* Financial Information */}
              <div className="glass" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CircleDollarSign size={18} color="var(--primary)" />
                  {t('loanDetail.financials')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <DetailItem label={t('marketTable.thTotalDebt')} value={loan.totalDebt} />
                  <DetailItem label={t('marketTable.thCollateral')} value={loan.collateral} />
                  <DetailItem label={loan.status === 'ACTIVE' ? 'Status' : t('marketTable.thStatus')} value={loan.status} isStatus />
                </div>
              </div>

              {/* Contract Details */}
              <div className="glass" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="var(--primary)" />
                  {t('loanDetail.contractDetails')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <DetailItem label={t('loanDetail.borrowerWallet')} value={loan.borrowerAddress} isAddress />
                  <DetailItem label={t('marketTable.thContract')} value={loan.contractAddress} isAddress />
                  <DetailItem label={t('marketTable.thToken')} value={loan.tokenName} />
                </div>
              </div>
            </div>

            {/* Risk Tranches Section Removed as requested */}
          </div>

          {/* Action / Sidebar Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Investment Card */}
            <div className="glass" style={{ padding: '24px', border: '1px solid var(--primary)' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '24px' }}>{t('loanDetail.investNow')}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div className="flex-between">
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{t('marketTable.thCalls')}</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>{loan.callsPercentage}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${loan.callsPercentage}%`, height: '100%', backgroundColor: 'var(--primary)' }} />
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: 'var(--primary)',
                  color: '#000',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '16px',
                  marginTop: '16px',
                  boxShadow: '0 0 20px rgba(56, 251, 219, 0.2)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {t('marketTable.investBtn')}
              </button>
            </div>

            {/* Help / Info Card Removed */}
          </div>
        </div>
      </div>

      <InvestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        loan={loan} 
      />

      {/* Footer */}
      <footer style={{ 
        padding: '32px 0', 
        borderTop: '1px solid var(--card-border)', 
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginTop: '64px'
      }}>
        <div className="container flex-between">
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            © 2026 Solvens Protocol. Code is Credit.
          </div>
          <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Github</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StatusBadge({ status }: { status: 'PENDING' | 'ACTIVE' | 'CANCELLED' }) {
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
}

function Layers({ size, color }: { size: number, color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
