//popup.js
function displayTrainData(data) {
    const container = document.createElement("div");
    container.className = "train-data-container";
    document.body.appendChild(container);
  
    // Loop through keys (train names)
    for (const [trainName, stationDelays] of Object.entries(data)) {
      const trainDiv = document.createElement("div");
      trainDiv.className = "train-item";
  
      const title = document.createElement("h3");
      title.innerText = `${trainName}`;
      trainDiv.appendChild(title);
  
      // Station delays
      stationDelays.forEach(([station, delay]) => {
        const delayDiv = document.createElement("div");
        delayDiv.innerText = `${station}: ${delay}`;
        delayDiv.style.marginLeft = "10px";
        trainDiv.appendChild(delayDiv);
      });
  
      container.appendChild(trainDiv);
    }
  }
  
  
chrome.runtime.sendMessage({ type: "get_delay_data" }, (response) => {
    if (response) {
      displayTrainData(response.data);
    } else {
      document.body.innerText = "No delay data available.";
    }
  });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (message.type === "refresh_popup") {
    // Reload data manually (without full refresh)
    chrome.runtime.sendMessage({ type: "get_delay_data" }, (response) => {
    if (response?.data) {
        displayTrainData(response.data);
    }
    });
}
});

