window.addEventListener("message", (event) => {
    if (event.source !== window) return;
  
    const { type, key, value } = event.data;
  
    // Save to chrome.storage.local
    if (type === "SET_STORAGE") {
      chrome.storage.local.set({ [key]: value }, () => {
        console.log(`✅ Stored ${key}: ${value}`);
      });
    }
  
    // Retrieve from chrome.storage.local
    if (type === "GET_STORAGE") {
      chrome.storage.local.get([key], (result) => {
        window.postMessage(
          { type: "STORAGE_RESULT", key, value: result[key] },
          "*"
        );
      });
    }
  
    // Clear data
    if (type === "REMOVE_STORAGE") {
      chrome.storage.local.remove([key], () => {
        console.log(`🗑️ Removed ${key}`);
      });
    }
  });
  