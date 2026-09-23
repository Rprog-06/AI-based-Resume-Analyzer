import fs from "fs";

const apiUrl = process.env.API_URL;

if (!apiUrl) {
    throw new Error("API_URL environment variable is not configured");
}

const template = fs.readFileSync("./config-template.js", "utf8");

const config = template.replace("__API_URL__", apiUrl);

fs.writeFileSync("./config.js", config);

console.log("✅ config.js generated successfully");