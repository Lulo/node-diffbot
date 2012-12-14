var should = require('should');
var Diffbot = require('../lib/diffbot').Diffbot;
var diffbot = new Diffbot('mytoken');

describe('Diffbot', function () {

  describe('#requestOpts', function () {

    it('Should throw an error if no URI given', function () {
      (function () {
        diffbot.requestOpts({});
      }).should.throw();
    });

    it('Should create correct URL for article API', function () {
      diffbot.requestOpts('article', {
        url: 'http://catswipe.com/why-cats-rule'
      }).should.eql({
        uri: 'http://diffbot.com/api/article?token=mytoken&format=json&url=' + encodeURIComponent('http://catswipe.com/why-cats-rule')
      });
    });

    it('Should create correct URL for frontpage API', function () {
      diffbot.requestOpts('frontpage', {
        url: 'http://catswipe.com/'
      }).should.eql({
        uri: 'http://diffbot.com/api/frontpage?token=mytoken&format=json&url=' + encodeURIComponent('http://catswipe.com/')
      });
    });

    it('Should support all options for article API', function () {
      diffbot.requestOpts('article', {
        url: 'http://catswipe.com/worship',
        callback: 'gotData',
        html: true,
        dontStripAds: true,
        tags: true,
        comments: true,
        stats: true
      }).should.eql({
        uri: 'http://diffbot.com/api/article?token=mytoken&format=json&url=' + encodeURIComponent('http://catswipe.com/worship') + '&callback=gotData&html=1&dontStripAds=1&tags=1&comments=1&stats=1'
      });
    });

  });

});

