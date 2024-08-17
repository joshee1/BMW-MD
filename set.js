const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY0Npb2FrWS9mbTVRTGZzYVovcndzLzBaNFFPNGJhV0U0bkxKZDk3YnpFOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNWErRUI3Yjl4a2dFME4zSHh2WTlnaHBFaUlTWVpNWjRLQzFaVitmMWhSRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJXQ0txK0UwajZHbExxWm5oaTNmRmZtTlBpeGUwSmpBdldmNGNrbTk2Z0VrPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJTditzTkNkOHFQRUM5UnRtWFdnS2sraEFXL2swc0tSYXFoeldHcXNwN3lvPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IklCR0R1d1EvV1RpMk1EdjJLRjVNSGMwd2QyOW9OcVQyNmhzZUFJVE1zR009In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkpwUDUrZzhyZmQ0SHEwakxET3d6R3kvVVdZS1VDbjBBdnJmbmF5VUdjSHM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR1AvdHNNOHBwakhQUElmMHUzM1dpNUJGeHljbW5RN3haQlhoR2JGNUUwRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoienVhVi9wbW5TRHowa1kvNDBRRHNqVHRZZEpJaS9DRGh4MC9xQTg3a1pUZz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ikp6b3B5bVh4eHRUTEZvRHRlU0JhK2MwSHRmOElBR241VW5Pak1CTjdXYnNiekdnSzlmTDh6dURCUnYwZkc3THFqTVRWLzh6V2E0bUdzYWNiYVN3Z0J3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTE5LCJhZHZTZWNyZXRLZXkiOiJNdzFGdUZRTXdXbHhjTGhGTk9aYnd2NWY2cERVa2FtUEZ3eVpEMjlJNmlvPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJ0eTJweWdIcVFONm9RV0tsNUFKSEVnIiwicGhvbmVJZCI6ImVmM2U3Y2Q5LTc4NDMtNGE2OS1hMDg3LTRmNjNmZjc2NTA2NiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJqTkdycG9tVGJOWXJzTm5SL28zTFZkcXZrSXM9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZFRETm9HZmM3UWMzSndkWnlDdGpmMVhCK0owPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IldONThZVFlIIiwibWUiOnsiaWQiOiIyNjA5NzE4MTY5NTY6NTRAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiTWFrbyJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTU9wbHNrRUVJekVnN1lHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiOXd0Z0F5aEV2N2xFZEFBSmwxQU5kTzZLNDN5U08zelAzRGdKY0tTT2ltdz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiOWtWY0xWZ3lPNkNzZi9scENUR3pEQlB5VkpaNFlnUkYxNzFJZkp5KzRjSHZuM2IxRGszUjlZNjZnZ1FwWWo5TW80Q2JDTERFR3VQRDV6MHQyUmpoQmc9PSIsImRldmljZVNpZ25hdHVyZSI6IlRWczViaVB6Q2N6aXlvdFl5ejJ3U0kwZ3plWEUzQVhjWWc2N0RDU0U2UldTR0JENi95OXY2cFEzMVNJV052Z1NkZ1NhYkFJd2JBSGJadDJlU3grOUR3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjYwOTcxODE2OTU2OjU0QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmZjTFlBTW9STCs1UkhRQUNaZFFEWFR1aXVOOGtqdDh6OXc0Q1hDa2pvcHMifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjM5MTY4MjUsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBUExrIn0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Ibrahim Adams",
    NUMERO_OWNER : process.env.NUMERO_OWNER || " Ibrahim Adams",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'BMW_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/17c83719a1b40e02971e4.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
