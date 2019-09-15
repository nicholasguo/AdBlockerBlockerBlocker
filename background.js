// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const block = async (url) => { await chrome.contentSettings.javascript.set({primaryPattern: httpsIfy(url), secondaryPattern: httpIfy(url), setting: "block"}); };
const allow = async (url) => { await chrome.contentSettings.javascript.set({primaryPattern: httpsIfy(url), secondaryPattern: httpIfy(url), setting: "allow"}); };

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