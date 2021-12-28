import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// This is our governance contract
const voteModule = sdk.getVoteModule(
    "0x5ec9DAAe2E6451b7Cc4ACa71d95D5d1923164045"
);

// This is our ERC-20 contract
const tokenModule = sdk.getTokenModule(
    "0x2C93cB3e419D3AA383fD909B40b9bfAD7666f2E0"
);
(async () => {
    try {
        // Give our treasury the power to mint additional tokens if needed
        await tokenModule.grantRole("minter", voteModule.address);

        console.log(
            "Successfully gave vote module permissions to act on token module"
        );
    } catch (error) {
        console.error(
            "failed to grant vote module permissions on token module",
            error
        );
        process.exit(1);
    }

    try {
        // Grab our wallet's token balance, we hold basically the entire supply right now
        const ownedTokenBalance = await tokenModule.balanceOf(
            process.env.WALLET_ADDRESS
        );

        // Grab 90% of the supply that we hold.
        const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
        const percent90 = ownedAmount.div(100).mul(90);

        // Transfer 90% of the supply to our voting contract.
        await tokenModule.transfer(
            voteModule.address,
            percent90
        );

        console.log("✅ Successfully transferred tokens to vote module");
    } catch (err) {
        console.error("failed to transfer tokens to vote module", err);
    }
})()