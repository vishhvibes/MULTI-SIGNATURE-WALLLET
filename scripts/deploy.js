const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Multi-Signature Wallet deployment on Core Testnet 2...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with the account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Example owners for the multi-sig wallet
  // Replace these with actual owner addresses
  const owners = [
    deployer.address, // First owner (deployer)
    "0x742d35Cc6635C0532925a3b8D9C3f4C35Dd5F1C5", // Example second owner
    "0x8ba1f109551bD432803012645Hac136c9.SetOKLM" // Example third owner (Replace with valid address)
  ];

  // Number of confirmations required (2 out of 3 owners)
  const numConfirmationsRequired = 2;

  try {
    // Get the contract factory
    const MultiSignatureWallet = await ethers.getContractFactory("MultiSignatureWallet");
    
    console.log("⏳ Deploying MultiSignatureWallet contract...");
    
    // Deploy the contract
    const multiSigWallet = await MultiSignatureWallet.deploy(owners, numConfirmationsRequired);
    
    // Wait for deployment to be mined
    await multiSigWallet.waitForDeployment();
    
    const contractAddress = await multiSigWallet.getAddress();
    
    console.log("✅ MultiSignatureWallet deployed successfully!");
    console.log("📍 Contract Address:", contractAddress);
    console.log("👥 Owners:", owners);
    console.log("🔢 Required Confirmations:", numConfirmationsRequired);
    
    // Verify deployment by calling a view function
    const deployedOwners = await multiSigWallet.getOwners();
    const requiredConfirmations = await multiSigWallet.numConfirmationsRequired();
    
    console.log("\n📊 Deployment Verification:");
    console.log("   Deployed Owners:", deployedOwners);
    console.log("   Required Confirmations:", requiredConfirmations.toString());
    
    // Save deployment information
    const deploymentInfo = {
      contractAddress: contractAddress,
      owners: deployedOwners,
      requiredConfirmations: requiredConfirmations.toString(),
      network: "Core Testnet 2",
      deploymentTime: new Date().toISOString(),
      deployerAddress: deployer.address
    };
    
    console.log("\n💾 Deployment Info:", JSON.stringify(deploymentInfo, null, 2));
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Handle errors
main()
  .then(() => {
    console.log("🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Deployment script failed:", error);
    process.exit(1);
  });
