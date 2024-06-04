chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    const url = new URL(tab.url);

    if (url.pathname.includes("view")) {
      chrome.scripting.executeScript({
        target: { tabId, allFrames: false },
        files: ["content-script.js"],
      });
    }
  }
});
