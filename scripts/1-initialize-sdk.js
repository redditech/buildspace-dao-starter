import { ThirdwebSDK } from "@3rdweb/sdk";
import ethers from "ethers";

// Importing and configuring our .env file that we use to securely store our environment variables
import dotenv from "dotenv";
dotenv.config();

// Some quick checks to make sure our .env is working.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
    console.log("🔴 Private key not found.")
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == "") {
    console.log("🔴 Alchemy API URL key not found.")
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
    console.log("🔴 Wallet Address not found.")
}

const sdk = new ThirdwebSDK(
    new ethers.Wallet(
        // Your wallet private key. ALWAYS KEEP THIS PRIVATE, DO NOT SUARE IT WITH ANYONE, 
        // add it to your .env file and do not commit that file to github
        process.env.PRIVATE_KEY,
        // RPC URL, we'll use our Alchemy API URL from .env file.
        ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
    ),
);

(async () => {
    try {
        const apps = await sdk.getApps();
        console.log("Your app address is:", apps[0].address);
    } catch (err) {
        console.error("Failed to get apps from the SDK", err);
        process.exit(1);
    }
})()

//We are exporting the initialised thirdweb sdk so that we acan use it in our ohter scripts
export default sdk;