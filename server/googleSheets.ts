// server/googleSheets.ts
import { google } from "googleapis";

export async function getSheetsClient() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  if (!privateKey || !clientEmail) {
    console.log("❌ Missing Google Sheets credentials");
    return null;
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function getUserByEmail(email: string) {
  const sheets = await getSheetsClient();
  if (!sheets) return null;

  const sheetId = process.env.SHEET_ID;
  const range = "Users!A:Z"; // fetches full Users sheet

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) return null;

  const header = rows[0];
  const emailIndex = header.indexOf("email");
  const passwordIndex = header.indexOf("password");

  const userRow = rows.find((r) => r[emailIndex] === email);
  if (!userRow) return null;

  return { header, row: userRow };
}

export async function getDailyLogsForUser(userId: string, date?: string) {
  const sheets = await getSheetsClient();
  if (!sheets) return null;

  const sheetId = process.env.SHEET_ID;
  const range = "daily_logs!A:Z";

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = response.data.values as any[] | undefined;
    if (!rows || rows.length === 0) return null;

    const header = rows[0];
    const userIdIndex = header.indexOf("user_id");
    const dateIndex = header.indexOf("date");

    const userLogs = rows.filter((r: any[]) => r[userIdIndex] === userId);
    if (date) {
      return userLogs.find((r: any[]) => r[dateIndex] === date);
    }
    return userLogs.length > 0 ? userLogs[userLogs.length - 1] : null;
  } catch (error) {
    console.error("Error fetching daily_logs:", error);
    return null;
  }
}

export async function getWeightLogsForUser(userId: string) {
  const sheets = await getSheetsClient();
  if (!sheets) return null;

  const sheetId = process.env.SHEET_ID;
  const range = "weight_logs!A:Z";

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = response.data.values as any[] | undefined;
    if (!rows || rows.length === 0) return null;

    const header = rows[0];
    const userIdIndex = header.indexOf("user_id");

    const userLogs = rows.filter((r: any[]) => r[userIdIndex] === userId);
    return userLogs.length > 0 ? userLogs[userLogs.length - 1] : null;
  } catch (error) {
    console.error("Error fetching weight_logs:", error);
    return null;
  }
}

export async function getStreakForUser(userId: string) {
  const sheets = await getSheetsClient();
  if (!sheets) return null;

  const sheetId = process.env.SHEET_ID;
  const range = "streaks!A:Z";

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = response.data.values as any[] | undefined;
    if (!rows || rows.length === 0) return null;

    const header = rows[0];
    const userIdIndex = header.indexOf("user_id");

    const userStreak = rows.find((r: any[]) => r[userIdIndex] === userId);
    return userStreak ? userStreak : null;
  } catch (error) {
    console.error("Error fetching streaks:", error);
    return null;
  }
}
