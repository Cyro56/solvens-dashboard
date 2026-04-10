import { ethers } from "ethers";
import "dotenv/config";
import fs from "fs";
import path from "path";
import solc from "solc";

async function main() {
    const isLocal = process.argv.includes("--local");

    const providerUrl = isLocal 
        ? "http://127.0.0.1:8545" 
        : (process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology");
    
    const provider = new ethers.JsonRpcProvider(providerUrl);
    
    let wallet;
    if (isLocal) {
        console.log("🏠 Usando Rede Local (Hardhat Node)");
        // Primeira conta padrão do Hardhat
        wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    } else if (process.env.PRIVATE_KEY) {
        console.log("🔑 Usando PRIVATE_KEY encontrada no .env");
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    } else if (process.env.MNEMONIC) {
        console.log("📝 Usando MNEMONIC encontrado no .env");
        wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC, provider);
    } else {
        console.error("❌ ERRO: Nenhuma PRIVATE_KEY ou MNEMONIC encontrada no arquivo .env");
        console.log("Por favor, adicione uma das duas no arquivo .env na raiz do projeto.");
        process.exit(1);
    }

    console.log("👤 Wallet:", wallet.address);
    const balance = await provider.getBalance(wallet.address);
    console.log(`💰 Saldo [${isLocal ? "Local" : "MATIC"}]:`, ethers.formatEther(balance));

    if (balance === 0n) throw new Error("Saldo insuficiente.");

    // Helper para ler arquivos de contrato
    const readContract = (file) => fs.readFileSync(path.resolve("contracts", file), "utf8");
    
    // Resolver para OpenZeppelin
    const findImports = (importPath) => {
        if (importPath.startsWith("@openzeppelin/")) {
            const fullPath = path.resolve("node_modules", importPath);
            return { contents: fs.readFileSync(fullPath, "utf8") };
        }
        if (importPath.startsWith("./")) {
             return { contents: fs.readFileSync(path.resolve("contracts", importPath.replace("./", "")), "utf8") };
        }
        return { error: "File not found" };
    };

    const input = {
        language: "Solidity",
        sources: {
            "SolvensVault.sol": { content: readContract("SolvensVault.sol") },
            "SolvensFactory.sol": { content: readContract("SolvensFactory.sol") }
        },
        settings: {
            optimizer: { enabled: true, runs: 200 },
            evmVersion: "cancun",
            outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } }
        }
    };

    console.log("🔨 Compilando...");
    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    if (output.errors) {
        output.errors.forEach(err => console.error(err.formattedMessage));
        if (output.errors.some(err => err.severity === "error")) process.exit(1);
    }

    const vaultData = output.contracts["SolvensVault.sol"]["SolvensVault"];
    const factoryData = output.contracts["SolvensFactory.sol"]["SolvensFactory"];

    console.log("✅ Compilado com sucesso.");

    // 1. Deploy SolvensVault (Implementation)
    console.log("\n📦 Deployando SolvensVault (Implementation)...");
    const VaultFactory = new ethers.ContractFactory(vaultData.abi, vaultData.evm.bytecode.object, wallet);
    const vault = await VaultFactory.deploy();
    const vaultReceipt = await vault.deploymentTransaction().wait();
    const vaultAddr = await vault.getAddress();
    console.log(`✔️ SolvensVault deployado no bloco ${vaultReceipt.blockNumber} em: ${vaultAddr}`);

    // Pequena pausa para sincronia do nonce (comum em redes locais ultra-rápidas)
    console.log("⏳ Aguardando sincronia de rede...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Deploy SolvensFactory
    console.log("📦 Deployando SolvensFactory...");
    const FactoryContract = new ethers.ContractFactory(factoryData.abi, factoryData.evm.bytecode.object, wallet);
    const factory = await FactoryContract.deploy(vaultAddr);
    const factoryReceipt = await factory.deploymentTransaction().wait();
    const factoryAddr = await factory.getAddress();
    console.log(`✔️ SolvensFactory deployada no bloco ${factoryReceipt.blockNumber} em: ${factoryAddr}`);

    console.log("\n--- DEPLOY CONCLUÍDO ---");
    console.log("Endereço da Factory para o Web3Manager.ts:", factoryAddr);
}

main().catch(error => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
});
