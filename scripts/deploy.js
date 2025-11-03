const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying CARVFi contracts...");

  // Deploy UserProfile
  const UserProfile = await ethers.getContractFactory("UserProfile");
  const userProfile = await UserProfile.deploy();
  await userProfile.deployed();
  console.log("✅ UserProfile deployed to:", userProfile.address);

  // Deploy BotProtection
  const BotProtection = await ethers.getContractFactory("BotProtection");
  const botProtection = await BotProtection.deploy();
  await botProtection.deployed();
  console.log("✅ BotProtection deployed to:", botProtection.address);

  // Deploy SocialRewards
  const SocialRewards = await ethers.getContractFactory("SocialRewards");
  const socialRewards = await SocialRewards.deploy(userProfile.address);
  await socialRewards.deployed();
  console.log("✅ SocialRewards deployed to:", socialRewards.address);

  // Save deployment addresses
  const deploymentInfo = {
    userProfile: userProfile.address,
    botProtection: botProtection.address,
    socialRewards: socialRewards.address,
    network: "carvTestnet",
    timestamp: new Date().toISOString()
  };

  console.log("📦 Deployment completed!");
  console.log("📋 Contract addresses:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
