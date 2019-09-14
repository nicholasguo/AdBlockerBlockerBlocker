// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.changeStatus === "block") {
      sendResponse({message: "blocked"});
      chrome.contentSettings.javascript.set({primaryPattern: request.url, setting: "block"});
    } else if (request.changeStatus === "unblock") {
      sendResponse({message: "unblocked"});
      chrome.contentSettings.javascript.set({primaryPattern: request.url, setting: "allow"});
    }
  }
)

chrome.storage.sync.get('urlBlacklist', function(result) {
  let list = result.urlBlacklist || [];
  list.forEach(element => {
    chrome.contentSettings.javascript.set({primaryPattern: element, setting: "block"});
  });
});