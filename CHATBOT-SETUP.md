# Chatbot — visitor name collection setup

The chat widget on `homepage.html` greets every visitor and asks their name.
To actually save those names (in one place, no duplicates), connect it to a
free Google Sheet. ~5 minutes, one time.

## 1. Create the Sheet
1. Go to https://sheets.google.com and create a new blank spreadsheet.
2. Name it anything (e.g. "Portfolio Visitors").

## 2. Add the script
1. In that sheet: **Extensions → Apps Script**.
2. Delete the sample code, then paste the entire contents of `visitor-names.gs`.
3. Click the **Save** (disk) icon.

## 3. Deploy as a Web App
1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" → choose **Web app**.
3. Set:
   - **Description:** anything
   - **Execute as:** Me
   - **Who has access:** **Anyone**   ← important, so visitors' browsers can post
4. Click **Deploy**, then **Authorize access** and allow the permissions
   (it's your own script, the "unsafe" warning is expected — click
   *Advanced → Go to project*).
5. Copy the **Web app URL** it gives you (ends in `/exec`).

## 4. Connect it to the site
1. Open `homepage.html`.
2. Find this line (near the bottom, in the chatbot script):
   ```js
   const SHEET_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
   ```
3. Replace the placeholder with your copied URL:
   ```js
   const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfy.../exec";
   ```
4. Save. Done — visitor names now land in your Sheet.

## Notes
- **Duplicates are skipped** server-side, case-insensitively ("john" == "John").
- Each visitor is only asked **once per browser** (remembered via localStorage);
  returning visitors get a "Welcome back" message instead.
- If you leave the placeholder in, the bot still works and greets people — it
  just doesn't save the names anywhere.
- To change the deployed script later, use **Deploy → Manage deployments →
  edit → New version** (re-deploying as a new deployment gives a new URL).
