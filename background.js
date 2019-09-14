// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

//let block = async (url) => {await chrome.contentSettings.javascript.set({primaryPattern: url, setting: "block"})};
//let allow = async (url) => {await chrome.contentSettings.javascript.set({primaryPattern: url, setting: "allow"})};

chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {
    if (request.message === "block")
      await chrome.contentSettings.javascript.set({primaryPattern: request.url, setting: "block"});
    else if (request.message === "allow")
      await chrome.contentSettings.javascript.set({primaryPattern: request.url, setting: "allow"});
    sendResponse({message: request.message + " echo"});
  }
)

chrome.storage.sync.get('urlBlacklist', function(result) {
  let list = result.urlBlacklist || [];
  list.forEach(element => chrome.contentSettings.javascript.set({primaryPattern: element, setting: "block"}));
});
