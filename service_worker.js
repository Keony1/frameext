chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    const url = new URL(tab.url);
    if (url.pathname.includes("/player")) {
      chrome.scripting
        .executeScript({
          target: { tabId, allFrames: false },
          files: ["content-script.js"],
        })
        .then(() => console.log("script inserido"));

      chrome.scripting
        .insertCSS({
          target: { tabId },
          files: ["content.css"],
        })
        .then(() => console.log("css inserido"));
    }
  }
});
