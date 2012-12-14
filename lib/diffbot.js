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
var async = require('async');
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
  var self = this;
  var requestOpts = this.requestOpts('article', options);
  request(requestOpts, function (err, res, body) {
    if (err) {
      callback(err);
    } else {
      var result = JSON.parse(body);
      if (options.multipage && result.nextPage) {
        self.articleMultipage(options, result, callback);
      } else {
        callback(null, result);
      }
    }
  });
};

Diffbot.prototype.articleMultipage = function (options, result, callback) {
  var self = this;
  var seen = [encodeURIComponent(options.uri || options.url)];
  var last = result;
  var key = options.html ? 'html' : 'text';
  options.multipage = false;

  async.whilst(
    function () {
      console.dir(seen);
      return last.nextPage && seen.indexOf(last.nextPage) < 0;
    },
    function (cb) {
      seen.push(last.nextPage);
      options.uri = decodeURIComponent(last.nextPage);
      self.article(options, function (err, nextResult) {
        if (err) {
          cb(err);
        } else {
          result[key] += nextResult[key];
          last = nextResult;
          cb();
        }
      });
    },
    function (err) {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    }
  );
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

