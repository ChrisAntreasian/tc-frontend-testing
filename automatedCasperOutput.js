/*==============================================================================*/
/* Casper generated Sun Aug 30 2015 20:04:52 GMT-0400 (EDT) */
/*==============================================================================*/
var casper = require(casper).create();
var x = require('casper').selectXPath;

casper.options.viewportSize = {width: 1273, height: 551};
casper.on('page.error', function(msg, trace) {
   this.echo('Error: ' + msg, 'ERROR');
   for(var i=0; i<trace.length; i++) {
       var step = trace[i];
       this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
   }
});
casper.test.begin('Resurrectio test', function(test) {
   casper.start('http://dev.teachcycle.com/');
   casper.waitForSelector("form .overlay__content .btn.submit-login",
       function success() {
           test.assertExists("form .overlay__content .btn.submit-login");
           this.click("form .overlay__content .btn.submit-login");
       },
       function fail() {
           test.assertExists("form .overlay__content .btn.submit-login");
   });
   casper.waitForSelector(x("//a[normalize-space(text())='Start a New Challenge']"),
       function success() {
           test.assertExists(x("//a[normalize-space(text())='Start a New Challenge']"));
           this.click(x("//a[normalize-space(text())='Start a New Challenge']"));
       },
       function fail() {
           test.assertExists(x("//a[normalize-space(text())='Start a New Challenge']"));
   });

   casper.run(function() {test.done();});
});