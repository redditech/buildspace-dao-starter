import sdk from "./1-initialize-sdk.js";

// In order to deploy the new contract we need the app module again
const app = sdk.getAppModule("0xd348542F9f9f861DA6c401E57D6160a2cbBA1C72");

(async () => {
    try {
        // Deploy a standard ERC-20 contract using contract at https://github.com/nftlabs/nftlabs-protocols/blob/main/contracts/Coin.sol
        const tokenModule = await app.deployTokenModule({
            // token name
            name: "Weird Breakfast DAO Governance Token",
            // symbol
            symbol: "WBD"
        });
        console.log(
            "✅ Successfully deployed token module, address:",
            tokenModule.address,
        );
    }
    catch (error) {
        console.error("failed to deploy token module", error);
    }
})();