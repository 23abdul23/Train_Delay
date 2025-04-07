//background.js

let latestDelayData = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "store_delay_data") {
    latestDelayData = message.data;
    console.log("✅ Received delay data:", latestDelayData);

    const tabId = sender.tab.id;

    // Enable and open side panel
    chrome.sidePanel.setOptions({
      tabId,
      path: "popup.html",
      enabled: true
    }).then(() => {
      chrome.sidePanel.open({ tabId }); // ✅ Auto-open panel
    });

    // Ask popup to refresh
    chrome.runtime.sendMessage({ type: "refresh_popup" });

    sendResponse({ status: "success" });
  }

  if (message.type === "get_delay_data") {
    sendResponse({ data: latestDelayData });
  }
});
