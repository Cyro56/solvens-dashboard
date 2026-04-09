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

export type Web3State = {
  account: string;
  balance: string; // MATIC balance
  usdcBalance: string; // USDC balance
  isTestnet: boolean;
  isConnecting: boolean;
  chainId: string;
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
    chainId: ''
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

    window.ethereum.on('accountsChanged', async (accounts: unknown) => {
      const accs = accounts as string[];
      const acc = accs[0] || '';
      if (acc) {
        const balances = await this.fetchAllBalances(acc);
        this.updateState({ account: acc, ...balances });
      } else {
        this.updateState({ account: '', balance: '0', usdcBalance: '0' });
      }
    });

    window.ethereum.on('chainChanged', async (chainId: unknown) => {
      const cId = chainId as string;
      const isTestnet = cId === POLYGON_AMOY.chainId;
      const balances = this.state.account ? await this.fetchAllBalances(this.state.account, isTestnet) : { balance: '0', usdcBalance: '0' };
      this.updateState({ 
        chainId: cId,
        isTestnet,
        ...balances
      });
    });
  }

  private async syncState() {
    if (typeof window === 'undefined' || !window.ethereum) return;
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
      const acc = accounts[0] || '';
      const isTestnet = chainId === POLYGON_AMOY.chainId;
      const balances = acc ? await this.fetchAllBalances(acc, isTestnet) : { balance: '0', usdcBalance: '0' };
      
      this.updateState({
        account: acc,
        ...balances,
        chainId,
        isTestnet
      });
    } catch (e) {
      console.warn("Falha ao sincronizar estado inicial da Web3", e);
    }
  }

  private async fetchAllBalances(address: string, isTestnetOverride?: boolean) {
    const isTestnet = isTestnetOverride !== undefined ? isTestnetOverride : this.state.isTestnet;
    const usdcAddr = isTestnet ? POLYGON_AMOY.usdcAddress : POLYGON_MAINNET.usdcAddress;
    
    const [balance, usdcBalance] = await Promise.all([
      this.fetchBalance(address),
      this.fetchTokenBalance(usdcAddr, address)
    ]);

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
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.chainId }],
      });
      // chainChanged listener will update state
    } catch (switchError: unknown) {
      if ((switchError as { code: number }).code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [config],
          });
        } catch (error) {
          throw new Error('Falha ao adicionar a rede.');
        }
      } else {
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
