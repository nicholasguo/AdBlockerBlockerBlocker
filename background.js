// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// import defaults from "./defaults.js";

const defaults = [
  "bloomberg.com",
  "bostonglobe.com",
  "economist.com", 
  "forbes.com",
  "medium.com",
  "newyorker.com",
  "nytimes.com", 
  "washingtonpost.com", 
];

const block = (url) => { 
  chrome.contentSettings.javascript.set({primaryPattern: httpsIfy(url), setting: "block"}); 
  chrome.contentSettings.javascript.set({primaryPattern: httpIfy(url), setting: "block"}); 
};
const allow = (url) => { 
  chrome.contentSettings.javascript.set({primaryPattern: httpsIfy(url), setting: "allow"}); 
  chrome.contentSettings.javascript.set({primaryPattern: httpIfy(url), setting: "allow"}); 
};

chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {
    if (request.message === "block")
      block(request.url);
    else if (request.message === "allow")
      allow(request.url);
    sendResponse({message: request.message + " echo"});
  }
);

chrome.storage.sync.get('urlBlacklist', function(result) {
  let list = result.urlBlacklist || defaults;
  list.forEach(element => { block(element) });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  let url = changeInfo.url;
  if (!url) {
    return;
  }
  chrome.contentSettings.javascript.get({primaryUrl: url}, function(jsSetting) {
    if (jsSetting.setting === "block") {
      chrome.browserAction.setBadgeText({text: "ON", tabId: tabId});
    } else {
      chrome.browserAction.setBadgeText({text: "", tabId: tabId});
    }
  });
});

const httpsIfy = (url) => "https://*." + url + "/*";

const httpIfy = (url) => "http://*." + url + "/*";
