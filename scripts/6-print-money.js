import {ethers} from "ethers";
import sdk from "./1-initialize-sdk.js";

// This is the address of our ERC-20 contract from the last script
const tokenModule = sdk.getTokenModule(
    "0x2C93cB3e419D3AA383fD909B40b9bfAD7666f2E0",
);
(async()=>{
    try {
        // The max supply
        const amount = 1_000_000;
        // We use the util function from "ethers" to convert the amount
        // to have 18 decimals (which is the standard for ERC20 tokens).
        const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);

        // Interact with the deployed ERC-20 contract and mint the tokens
        await tokenModule.mint(amountWith18Decimals);
        const totalSupply = await tokenModule.totalSupply();

        // Print out how many of our tokens are out there now!
        console.log(
            "✅ There now is",
            ethers.utils.formatUnits(totalSupply, 18),
            "$WBD in circulation"
        );
    } catch (error) {
        console.error("Failed to print money", error);
    }
})();