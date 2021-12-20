import sdk from "./1-initialize-sdk.js";
import {readFileSync} from "fs";

const bundleDrop = sdk.getBundleDropModule(
    "0x7499b893FD8A2f6d74C05770E65F1344d01605C0"
);

(async () => {
    try {
        await bundleDrop.createBatch([
            {
                name: "Ingredients for Zaboca Buljol",
                description: "This NFT will give you access to the Weird Breakfasts DAO",
                image: readFileSync("scripts/assets/weirdbreakfastingredients.png"),
            },
        ]);
        console.log("✅ Successfully created a new NFT in the drop!");
    } catch (error) {
        console.error("failed to create the new NFT", error);
    }
})()