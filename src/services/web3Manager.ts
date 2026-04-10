import Web3 from 'web3';

export interface ChainConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  usdcAddress: string; // Updated to USDC
}

export const POLYGON_MAINNET: ChainConfig = {
  chainId: '0x89', // 137
  chainName: 'Polygon Mainnet',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: ['https://polygon-rpc.com'],
  blockExplorerUrls: ['https://polygonscan.com'],
  usdcAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
};

export const POLYGON_AMOY: ChainConfig = {
  chainId: '0x13882', // 80002
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: ['https://rpc-amoy.polygon.technology'],
  blockExplorerUrls: ['https://amoy.polygonscan.com'],
  usdcAddress: '0x8b0180f2101c8260d49339abfee87927412494b4', // Mock USDC(PoS) from transaction
};

export const HARDHAT_LOCALHOST: ChainConfig = {
  chainId: '0x7a69', // 31337
  chainName: 'Hardhat Localhost',
  nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
  rpcUrls: ['http://127.0.0.1:8545'],
  blockExplorerUrls: [],
  usdcAddress: '0x0000000000000000000000000000000000000000', // Sem USDC real na rede local
};

const MINIMAL_ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "type": "function"
  },
  {
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "mint",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const FACTORY_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "vaultAddress", "type": "address" },
      { "indexed": true, "name": "borrower", "type": "address" },
      { "indexed": false, "name": "tokenName", "type": "string" },
      { "indexed": false, "name": "totalDebt", "type": "uint256" },
      { "indexed": false, "name": "apr", "type": "uint256" },
      { "indexed": false, "name": "collateral", "type": "uint256" }
    ],
    "name": "LoanCreated",
    "type": "event"
  },
  {
    "inputs": [
      { "name": "_tokenName", "type": "string" },
      { "name": "_amount", "type": "uint256" },
      { "name": "_apr", "type": "uint256" },
      { "name": "_duration", "type": "uint256" },
      { "name": "_collateral", "type": "uint256" }
    ],
    "name": "createLoan",
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const VAULT_ABI = [
  {
    "inputs": [],
    "name": "targetAmount",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "collateralAmount",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "apr",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "investor", "type": "address" },
      { "indexed": false, "name": "position", "type": "uint256" },
      { "indexed": false, "name": "amount", "type": "uint256" }
    ],
    "name": "Invested",
    "type": "event"
  }
];

const FACTORY_ADDRESSES: Record<string, string> = {
  'simulate': '0x0000000000000000000000000000000000000000', // Amoy
  'local': '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',    // Local Hardhat
  'real': '0x0000000000000000000000000000000000000000'
};

export interface VaultState {
  targetAmount: string;
  collateralAmount: string;
  apr: number;
  totalCallerInv: string;
  totalSellerInv: string;
}

export type Web3State = {
  account: string;
  balance: string; // MATIC balance
  usdcBalance: string; // USDC balance
  isTestnet: boolean;
  isConnecting: boolean;
  chainId: string;
  networkName: string;
};

type Listener = (state: Web3State) => void;

class Web3Manager {
  private static instance: Web3Manager;
  private web3: Web3 | null = null;

  // Internal Global State
  private state: Web3State = {
    account: '',
    balance: '0',
    usdcBalance: '0',
    isTestnet: true, // Defaulting to Simulated
    isConnecting: false,
    chainId: '',
    networkName: 'Detecting...'
  };

  private listeners: Listener[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupListeners();
      this.syncState();
    }
  }

  private getWeb3(): Web3 | null {
    if (typeof window !== 'undefined' && window.ethereum) {
      if (!this.web3) {
        let provider = window.ethereum;

        // Handle multiple providers (e.g. MetaMask + FlowOS)
        const ethereum = window.ethereum as { providers?: any[] };
        if (ethereum.providers) {
          provider = ethereum.providers.find((p: any) => p.isMetaMask) || ethereum.providers[0];
        }

        this.web3 = new Web3(provider);
      }
      return this.web3;
    }
    return null;
  }

  public static getInstance(): Web3Manager {
    if (!Web3Manager.instance) {
      Web3Manager.instance = new Web3Manager();
    }
    return Web3Manager.instance;
  }

  // State Subscription Pattern
  public subscribe(listener: Listener) {
    this.listeners.push(listener);
    listener(this.state); // Immediate sync on subscribe
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.state));
  }

  private updateState(newState: Partial<Web3State>) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  public getState(): Web3State {
    return this.state;
  }

  private setupListeners() {
    if (typeof window === 'undefined' || !window.ethereum) return;

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });

    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });
  }

  private async syncState() {
    if (typeof window === 'undefined' || !window.ethereum) return;
    try {
      const chainIdRaw = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      const chainId = chainIdRaw.toLowerCase();
      
      console.log(`%c[FORCE_LOG] MetaMask ChainID: ${chainIdRaw} | Local: ${HARDHAT_LOCALHOST.chainId}`, "color: yellow; font-weight: bold; font-size: 14px");

      const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
      const acc = accounts[0] || '';

      const isLocal = chainId === HARDHAT_LOCALHOST.chainId.toLowerCase() || chainId === '31337' || chainId === '0x7a69';
      const isAmoy = chainId === POLYGON_AMOY.chainId.toLowerCase() || chainId === '80002' || chainId === '0x13882';
      const isPolygon = chainId === POLYGON_MAINNET.chainId.toLowerCase() || chainId === '137' || chainId === '0x89';

      let networkName = 'Unknown Network';
      if (isLocal) networkName = 'Localhost';
      else if (isAmoy) networkName = 'Amoy';
      else if (isPolygon) networkName = 'Polygon';

      console.log(`%c[FORCE_LOG] Result -> isLocal: ${isLocal} | isAmoy: ${isAmoy} | Name: ${networkName}`, "color: lime; font-weight: bold;");

      const balances = acc ? await this.fetchAllBalances(acc, chainId) : { balance: '0', usdcBalance: '0' };

      this.updateState({
        account: acc,
        ...balances,
        chainId,
        networkName,
        isTestnet: isAmoy || isLocal
      });
    } catch (e) {
      console.warn("Falha ao sincronizar estado inicial da Web3", e);
    }
  }

  private async fetchAllBalances(address: string, chainIdOverride?: string) {
    const rawId = chainIdOverride || this.state.chainId || '';
    const currentChainId = rawId.toLowerCase();
    const isLocal = currentChainId === HARDHAT_LOCALHOST.chainId.toLowerCase() || currentChainId === '31337' || currentChainId === '0x7a69';

    let usdcAddr: string;
    if (isLocal) {
      usdcAddr = HARDHAT_LOCALHOST.usdcAddress;
    } else {
      const isAmoy = currentChainId === POLYGON_AMOY.chainId.toLowerCase() || currentChainId === '80002' || currentChainId === '0x13882';
      usdcAddr = isAmoy ? POLYGON_AMOY.usdcAddress : POLYGON_MAINNET.usdcAddress;
    }

    const balance = await this.fetchBalance(address);
    const usdcBalance = (!usdcAddr || usdcAddr === '0x0000000000000000000000000000000000000000')
      ? '0.00'
      : await this.fetchTokenBalance(usdcAddr, address);

    return { balance, usdcBalance };
  }

  public async fetchBalance(address: string): Promise<string> {
    const web3 = this.getWeb3();
    if (!web3) return '0';
    try {
      const balanceWei = await web3.eth.getBalance(address);
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      return parseFloat(balanceEth).toFixed(4);
    } catch (e) {
      return '0';
    }
  }

  public async fetchTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    const web3 = this.getWeb3();
    if (!web3) return '0';
    try {
      const contract = new web3.eth.Contract(MINIMAL_ERC20_ABI as any, tokenAddress);
      const [balance, decimals] = await Promise.all([
        contract.methods.balanceOf(userAddress).call(),
        contract.methods.decimals().call()
      ]);

      const formattedBalance = Number(balance) / Math.pow(10, Number(decimals));
      return formattedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } catch (e) {
      console.warn("Falha ao buscar saldo de token", e);
      return '0.00';
    }
  }

  public async mintUSDC(): Promise<void> {
    const web3 = this.getWeb3();
    if (!web3 || !this.state.account || !this.state.isTestnet) {
      throw new Error('Faucet disponível apenas no mercado Simulado e com carteira conectada.');
    }

    const usdcAddr = POLYGON_AMOY.usdcAddress;
    const contract = new web3.eth.Contract(MINIMAL_ERC20_ABI as any, usdcAddr);

    // Default mint 1000 USDC (Amoy mock uses 18 or 6 decimals, Amoy mock usually 18)
    const amount = web3.utils.toWei('1000', 'ether');

    await contract.methods.mint(this.state.account, amount).send({
      from: this.state.account
    });

    // Refresh balances after mint
    const balances = await this.fetchAllBalances(this.state.account);
    this.updateState({ ...balances });
  }

  public async deployLoan(amount: string, apr: string, duration: number, collateral: string): Promise<string> {
    const web3 = this.getWeb3();
    if (!web3 || !this.state.account) throw new Error('Conecte sua carteira para criar um empréstimo.');

    const currentChainId = (this.state.chainId || '').toLowerCase();
    const isLocal = currentChainId === HARDHAT_LOCALHOST.chainId.toLowerCase();
    const isAmoy = currentChainId === POLYGON_AMOY.chainId.toLowerCase();

    console.log(`[DEPLOY_LOAN] Executando na rede: ${currentChainId} (isLocal: ${isLocal})`);
    
    const factoryAddr = isLocal
      ? FACTORY_ADDRESSES.local
      : isAmoy
        ? FACTORY_ADDRESSES.simulate
        : FACTORY_ADDRESSES.real;

    if (!factoryAddr || factoryAddr === '0x0000000000000000000000000000000000000000') {
      throw new Error(
        `Nenhum contrato Factory encontrado para a rede atual (${this.state.chainId}). ` +
        `Conecte ao Hardhat Local (31337) ou Amoy (80002).`
      );
    }

    const factory = new web3.eth.Contract(FACTORY_ABI as any, factoryAddr);

    // Identifica a unidade de decimais (Ether=18 para Local/Amoy, mwei=6 para USDC Real)
    const isLocalOrAmoy = isLocal || isAmoy;
    const unit = isLocalOrAmoy ? 'ether' : 'mwei';

    // Valores em unidades mínimas
    const amountRaw = web3.utils.toWei(amount, unit);
    const collateralRaw = web3.utils.toWei(collateral, unit);
    const aprRaw = Math.floor(parseFloat(apr) * 100); 
    const durationSeconds = duration * 24 * 60 * 60;

    // Aguarda confirmação real on-chain (receipt)
    const receipt = await factory.methods.createLoan(
      'sUSDC-Debt',
      amountRaw,
      aprRaw,
      durationSeconds,
      collateralRaw
    ).send({ from: this.state.account });

    if (!receipt.status) {
      throw new Error('Transação revertida pela rede. Verifique os parâmetros do empréstimo.');
    }

    return receipt.transactionHash as string;
  }

  public async fetchLoansFromLogs() {
    const web3 = this.getWeb3();
    if (!web3) return [];

    const currentChainId = (this.state.chainId || '').toLowerCase();
    const isLocal = currentChainId === HARDHAT_LOCALHOST.chainId.toLowerCase() || currentChainId === '31337' || currentChainId === '0x7a69';
    const isAmoy = currentChainId === POLYGON_AMOY.chainId.toLowerCase() || currentChainId === '80002' || currentChainId === '0x13882';

    const factoryAddr = isLocal
      ? FACTORY_ADDRESSES.local
      : isAmoy
        ? FACTORY_ADDRESSES.simulate
        : FACTORY_ADDRESSES.real;

    if (!factoryAddr || factoryAddr === '0x0000000000000000000000000000000000000000') {
      return [];
    }

    const factory = new web3.eth.Contract(FACTORY_ABI as any, factoryAddr);
    try {
      const events = await factory.getPastEvents('LoanCreated', {
        fromBlock: 0,
        toBlock: 'latest'
      });

      if (!events || events.length === 0) return [];

      return events.map((event: any) => {
        try {
          const vals = event.returnValues;
          // Local/Testnet use 18 decimals (ether), Mainnet uses 6 (mwei)
          const unit = (isLocal || isAmoy) ? 'ether' : 'mwei';

          // Convertemos explicitamente para String antes de passar para o Web3 ou Number
          // para evitar o erro "Cannot mix BigInt and other types"
          const debtStr = vals.totalDebt?.toString() || '0';
          const collateralStr = vals.collateral?.toString() || '0';
          const aprStr = vals.apr?.toString() || '0';

          const debtNum = parseFloat(web3.utils.fromWei(debtStr, unit));
          const collateralNum = parseFloat(web3.utils.fromWei(collateralStr, unit));

          // Cálculos baseados na regra de negócio (Waterfall) - Prêmio Líquido
          const collScore = Math.round((collateralNum / (debtNum || 1)) * 100);
          const estSellerYield = (((collateralNum + Math.abs(0 - debtNum)) - debtNum) / (debtNum || 1) * 100);

          return {
            id: event.transactionHash,
            contractAddress: vals.vaultAddress,
            borrowerAddress: vals.borrower,
            tokenName: vals.tokenName,
            totalDebt: web3.utils.fromWei(debtStr, unit) + ' USDC',
            callerAPR: (Number(aprStr) / 100).toFixed(2) + '%',
            sellerPrize: estSellerYield.toFixed(2) + '%',
            collateral: web3.utils.fromWei(collateralStr, unit) + ' USDC',
            collateralScore: collScore,
            callsPercentage: 0,
            status: 'PENDING' as const
          };
        } catch (err) {
          console.error("Falha ao processar log individual:", err);
          return null;
        }
      }).filter(l => l !== null);
    } catch (e) {
      console.error("Erro ao carregar logs da Factory:", e);
      return [];
    }
  }

  public async getVaultState(vaultAddress: string): Promise<VaultState | null> {
    const web3 = this.getWeb3();
    if (!web3) return null;

    try {
      const vault = new web3.eth.Contract(VAULT_ABI as any, vaultAddress);
      
      // Busca parâmetros base (Target, Collateral e APR)
      const targetRaw = await vault.methods.targetAmount().call() as any;
      const collateralRaw = await vault.methods.collateralAmount().call() as any;
      const aprRaw = await vault.methods.apr().call() as any;

      // Busca todos os logs de investimento desde o bloco zero
      const events = await vault.getPastEvents('Invested', {
        fromBlock: 0,
        toBlock: 'latest'
      });

      let totalCaller = BigInt(0);
      let totalSeller = BigInt(0);

      events.forEach((event: any) => {
        const { position, amount } = event.returnValues;
        if (Number(position) === 0) {
          totalCaller += BigInt(amount);
        } else if (Number(position) === 1) {
          totalSeller += BigInt(amount);
        }
      });

      return {
        targetAmount: targetRaw.toString(),
        collateralAmount: collateralRaw.toString(),
        apr: Number(aprRaw),
        totalCallerInv: totalCaller.toString(),
        totalSellerInv: totalSeller.toString()
      };
    } catch (e) {
      console.error(`Erro ao buscar estado do cofre ${vaultAddress}:`, e);
      return null;
    }
  }

  public async connect(): Promise<string> {
    const web3 = this.getWeb3();
    if (!web3 || !window.ethereum) {
      throw new Error('MetaMask não detectada.');
    }

    this.updateState({ isConnecting: true });
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      if (!accounts || accounts.length === 0) throw new Error('Nenhuma conta selecionada.');

      const acc = accounts[0];
      const balances = await this.fetchAllBalances(acc);
      this.updateState({ account: acc, ...balances });
      return acc;
    } finally {
      this.updateState({ isConnecting: false });
    }
  }

  public async switchNetwork(config: ChainConfig): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask não detectada. Instale a extensão para alternar mercados.');
    }

    try {
      console.log(`[NETWORK] Solicitando troca para ${config.chainName} (${config.chainId})...`);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.chainId }],
      });
    } catch (switchError: any) {
      // Código 4902 indica que a rede não está cadastrada no MetaMask
      if (switchError.code === 4902) {
        try {
          console.log(`[NETWORK] Rede não encontrada. Solicitando adição de ${config.chainName}...`);
          
          // Filtramos apenas os campos que o MetaMask aceita em wallet_addEthereumChain
          const addParams = {
            chainId: config.chainId,
            chainName: config.chainName,
            nativeCurrency: config.nativeCurrency,
            rpcUrls: config.rpcUrls,
            blockExplorerUrls: config.blockExplorerUrls
          };

          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [addParams],
          });
        } catch (addError) {
          console.error('[NETWORK] Falha ao adicionar rede:', addError);
          throw new Error(`Não foi possível adicionar a rede ${config.chainName} ao seu MetaMask.`);
        }
      } else if (switchError.code === 4001) {
        throw new Error('Troca de rede cancelada pelo usuário.');
      } else {
        console.error('[NETWORK] Erro desconhecido ao trocar rede:', switchError);
        throw switchError;
      }
    }
  }

  public shortenAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
}

export const web3Manager = Web3Manager.getInstance();
