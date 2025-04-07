# Train_Delay

# 🚆 Train Delay Info Chrome Extension

A Chrome Extension that shows average train delay times directly on the IRCTC train search page — making travel planning a lot smarter and informed!

---

## 🔍 Motivation

Whenever we book tickets on a new train that we’ve never taken before, the biggest unknown is:
> **"Will this train arrive on time?"**

This extension solves that problem by providing **historical delay data** fetched from the last month, so you can make better decisions.

---

## ⚙️ How It Works

- On hovering over a train listing on the IRCTC page, a small **popup appears** beside the train block.
- This popup fetches and displays **average delays** at upcoming stations, based on data scraped from historical sources.
- Only **one popup** appears at a time and can be **manually closed**.
- A delay is added after closing a popup to prevent instant reappearing.

---

## 🛠️ Technologies Used

### 🧩 Frontend:
- **Chrome Extension APIs**
- **JavaScript (ES6)** for DOM parsing, event handling, and UI rendering

### 🐍 Backend:
- **Python + Flask** to scrape, process, and serve delay data
- **Fetch API** used for browser-to-localhost communication

---

## 🚀 How to Use

1. Clone this repo:
   ```bash
   git clone https://github.com/23abdul23/Train_Delay.git

   
2. Start the server
   ```bash
    cd backend
    python server.py


3. Load the Chrome Extension:

    Go to chrome://extensions
   
    Enable Developer Mode

    Click Load unpacked and select the extension/ folder (where you have cloned the repo)


4. Visit the IRCTC Train Search Page


5. Hover over any train — see the delay data appear magically!
