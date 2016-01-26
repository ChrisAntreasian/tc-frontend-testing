
var fs = require( 'fs' );
var phantomcss = require('./node_modules/phantomcss/phantomcss.js');

var testOptions = require('./test-options.js');

var lessonId = '522776';
lessonId = '634877';

var screenshotUrl = testOptions.lessonSources.live + lessonId;

// // update settings to display logging to console
casper.options.logLevel = 'debug';
casper.options.verbose = true;

casper.test.begin('BL public page tests', function( test ) {
  
  // phantom css settings
  phantomcss.init({
    rebase: casper.cli.get( "rebase" ),
    casper: casper,
    cleanupComparisonImages: true,
    libraryRoot: './node_modules/phantomcss',
    screenshotRoot: './screenshots' ,
    comparisonResultRoot: './comparisons',
    failedComparisonsRoot: './failures' ,
    addLabelToFailedImage: false
  });

  // phantom has a message tell us about it 
  casper.on( 'remote.message', function ( msg ) {
      this.echo( msg );
  });
  
  // phantom has errored
  casper.on( 'error', function ( err ) {
      this.die( "PhantomJS has errored: " + err );
  });

  // phantom cant load the resource
  casper.on( 'resource.error', function ( err ) {
      casper.log( 'Resource load error: ' + err, 'warning' );
  });

  // navigate to the appropreate url
  casper.start(screenshotUrl);

  // let us know that you got there correctly
  casper.then( function() {
    this.echo('Current location: ' + this.getCurrentUrl());
  });

  // for each viewport in the viewport object
  casper.each(testOptions.viewports, function(casper, viewport) {
    
    // give the images 5 seconds to allow the images to load
    // @ TODO replace with images loaded evaluation
    this.thenOpen(screenshotUrl, function() {
      this.wait(5000);
    });
    
    // evaluate the bodys height with the document's instance of jquery
    this.then(function() {
      pageHeight = this.evaluate(function() {
        return jQuery('body').height();
      });
    });
        
    // take a screen shot with the screen shot width and the page height
    this.then(function(){
      phantomcss.screenshot({
          top: 0,
          left: 0,
          width: viewport.viewport.width,
          height: pageHeight
      }, viewport.name);
    });

  });

  // compare screenshots
  casper.then( function now_check_the_screenshots() {
    phantomcss.compareAll();
  });
  
  // run the tests  
  casper.run( function () {
    console.log( '\nTHE END.' );
    phantomcss.getExitStatus() // pass or fail?
    casper.test.done();
  });

});