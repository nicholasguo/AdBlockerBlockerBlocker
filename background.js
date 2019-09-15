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
  chrome.contentSettings.javascript.set({primaryPattern: httpsIfy(url), setting: "allow"}); 
};

chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {
    if (request.message === "block")
      block(request.url);
    else if (request.message === "allow")
      block(request.url);
    sendResponse({message: request.message + " echo"});
  }
);

chrome.storage.sync.get('urlBlacklist', function(result) {
  let list = result.urlBlacklist || [];
  list.forEach(element => { block(element) });
});

const httpsIfy = (url) => "https://*." + url + "/*";

const httpIfy = (url) => "http://*." + url + "/*";
