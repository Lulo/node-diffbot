// diffbot - node.js api wrapper for diffbot
// http://github.com/markbao/node-diffbot
//
// Copyright 2011 Mark Bao
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
// http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var request = require('request');
var formatUrl = require('url').format;

var Diffbot = exports.Diffbot =
  function (token) {
    this.token = token;
  };

Diffbot.prototype.baseUrlObj = function (endpoint) {
  return {
    protocol: 'http:',
    host: 'diffbot.com',
    pathname: '/api/' + endpoint,
    query: {
      token: this.token,
      format: 'json'
    }
  };
};

Diffbot.prototype.requestOpts = function (endpoint, options) {
  // support 'url'
  if (options.url) {
    options.uri = options.url;
  }

  if (!options.uri) {
    throw new Error("the URI is required.");
  }

  var urlObj = this.baseUrlObj(endpoint);
  var params = urlObj.query;
  params.url = options.uri;

  if (options.callback) {
    params.callback = options.callback;
  }

  if (options.html) {
    params.html = 1;
  }

  if (options.dontStripAds) {
    params.dontStripAds = 1;
  }

  if (options.tags) {
    params.tags = 1;
  }

  if (options.comments) {
    params.comments = 1;
  }

  if (options.stats) {
    params.stats = 1;
  }

  return {
    uri: formatUrl(urlObj)
  };
};

Diffbot.prototype.article = function (options, callback) {
  var requestOpts = this.requestOpts('article', options);
  request(requestOpts, function (err, res, body) {
    if (err) {
      callback(err);
    } else {
      callback(null, JSON.parse(body));
    }
  });
};

Diffbot.prototype.frontpage = function (options, callback) {
  var requestOpts = this.requestOpts('frontpage', options);
  request(requestOpts, function (err, res, body) {
    if (err) {
      callback(err);
    } else {
      callback(null, JSON.parse(body));
    }
  });
};

