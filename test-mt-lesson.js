
var fs = require( 'fs' );
var phantomcss = require('./node_modules/phantomcss/phantomcss.js');

var testOptions = require('./test-options.js');


// make sure the user included a lesson id as an argument
if (!casper.cli.get('id')) {
    casper.echo('Please include a lesson id when calling this script.', 'ERROR').exit(1);
}

// check if a branch argument was passed in if not default to production
var branch = !casper.cli.get('branch') ? 'prod' : casper.cli.get('branch');

// set up the url string
var lessonId = casper.cli.get('id');
var screenshotUrl = testOptions.lessonSources[branch] + lessonId;

// update settings to display logging to console
casper.options.logLevel = 'debug';
casper.options.verbose = true;

// set up the casper test case
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
        addIteratorToImage: false,
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
        this.echo('Current location: ' + this.getCurrentUrl(), 'GREEN_BAR');
    });

    // for each viewport in the viewport object
    casper.each(testOptions.viewports, function(casper, viewport) {
        
        // set the view port of the page
        this.then(function() {
            this.viewport(viewport.viewport.width, viewport.viewport.height);
        });
        
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
            }, 'lesson-' + lessonId + '-' + viewport.name);
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