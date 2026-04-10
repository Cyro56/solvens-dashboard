import hre from "hardhat";

async function main() {
  console.log("Iniciando deploy na rede:", hre.network.name);

  // 1. Deploy da Implementação do Vault (Master Copy)
  const SolvensVault = await hre.ethers.getContractFactory("SolvensVault");
  const vaultImplementation = await SolvensVault.deploy();
  await vaultImplementation.waitForDeployment();
  const vaultImplementationAddress = await vaultImplementation.getAddress();
  console.log("SolvensVault (Implementação) deployado em:", vaultImplementationAddress);

  // 2. Deploy da Factory usando a implementação acima
  const SolvensFactory = await hre.ethers.getContractFactory("SolvensFactory");
  const factory = await SolvensFactory.deploy(vaultImplementationAddress);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("SolvensFactory deployada em:", factoryAddress);

  console.log("\n--- DEPLOY CONCLUÍDO ---");
  console.log("Copie o endereço da Factory para o Web3Manager.ts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
