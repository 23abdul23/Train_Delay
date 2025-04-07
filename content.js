chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Inject popup styles
  const style = document.createElement("style");
  style.textContent = `
    .info-popup {
      position: absolute;
      bottom: 5px;
      left: 5px;
      background: #fff;
      border: 1px solid #aaa;
      border-radius: 8px;
      padding: 8px 12px;
      font-family: monospace;
      font-size: 12px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      z-index: 9999;
      min-width: 150px;
      max-width: 250px;
    }
    .popup-close {
      position: absolute;
      top: 3px;
      right: 6px;
      font-weight: bold;
      color: #333;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  let currentPopup = null;
  let currentTrainNo = null;
  let popupCooldown = false;
  let lastHoveredElement = null;

  document.body.addEventListener("mouseover", async function (event) {
    if (popupCooldown) {
      // Cooldown active, skip
      return;
    }

    let current = event.target;
    while (current && !current.classList?.contains("bull-back")) {
      current = current.parentElement;
    }

    if (
      current &&
      current.matches(".form-group.no-pad.col-xs-12.bull-back.border-all")
    ) {
      // Avoid repeated popups on same hover
      if (current === lastHoveredElement) return;
      lastHoveredElement = current;

      const text = current.innerText;
      const train_detail = text.split(")")[0];
      const train_no = train_detail.split("(")[1]?.trim();
      const train_name = train_detail.split("(")[0]?.trim();

      if (train_no === currentTrainNo) return;

      if (currentPopup) return; // Already a popup showing

      currentTrainNo = train_no;

      const popup = document.createElement("div");
      popup.className = "info-popup";
      popup.innerHTML = `
        <div class="popup-close" title="Close">×</div>
        <div><strong>${train_name}</strong></div>
        <div>Loading delay info...</div>
      `;

      current.style.position = "relative";
      current.appendChild(popup);
      currentPopup = popup;

      popup.querySelector(".popup-close").onclick = () => {
        popup.remove();
        currentPopup = null;
        currentTrainNo = null;
        popupCooldown = true;
        lastHoveredElement = null; // allow future hovers

        setTimeout(() => {
          popupCooldown = false;
        }, 1000);
      };

      try {
        const response = await fetch("http://localhost:5000/save-delay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([{ train_no, train_name }]),
        });

        const delayData = await response.json();
        const infoDiv = popup.querySelector("div:nth-child(3)");
        infoDiv.innerHTML = "";

        delayData[train_name]?.forEach(([station, delay]) => {
          const div = document.createElement("div");
          div.innerText = `${station}: ${delay}`;
          infoDiv.appendChild(div);
        });
      } catch (err) {
        popup.querySelector("div:nth-child(3)").innerText = "Failed to load delay info.";
      }
    }
  });

  // Clear the lastHoveredElement when mouse leaves
  document.body.addEventListener("mouseout", (event) => {
    const toElement = event.relatedTarget;
    if (!toElement || !toElement.closest(".bull-back")) {
      lastHoveredElement = null;
    }
  });

});


