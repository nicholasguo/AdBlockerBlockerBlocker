// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

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
  let list = result.urlBlacklist || [];
  list.forEach(element => { block(element) });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  let url = changeInfo.url;
  if (!url) {
    return;
  }
  chrome.contentSettings.javascript.get({primaryUrl: url}, function(jsSetting) {
    if (jsSetting.setting === "block") {
      chrome.browserAction.setIcon({
        path: "images/get_started32.png",
        tabId: tabId,
      });
    } else {
      chrome.browserAction.setIcon({
        path: "images/rubberduck32.jpg",
        tabId: tabId,
      });
    }
  });
});

const httpsIfy = (url) => "https://*." + url + "/*";

const httpIfy = (url) => "http://*." + url + "/*";
