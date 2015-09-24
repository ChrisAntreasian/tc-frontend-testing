var settings = {
    enterancePoint: 'http://dev.teachcycle.com/login',
    // cookieFileName: './cookies/tcCookies.txt',
    user : {
        email: '###',
        password: '###'
    }
}

var fs = require('fs');
var casper = require('casper').create({
    waitTimeout: 10000,
    verbose: true
});

// var cookies = JSON.stringify(phantom.cookies);
// casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

// set up wait for change function never gets called
if (!casper.waitForUrlChange) {
    casper.waitForUrlChange = function(){
        var oldUrl;
        // add the check function to the beginning of the arguments...
        Array.prototype.unshift.call(arguments, function check(){
            return oldUrl === this.getCurrentUrl();
        });
        this.then(function(){
            oldUrl = this.getCurrentUrl();
        });
        this.waitFor.apply(this, arguments);
        return this;
    };
}

// enter tc com
casper.start(settings.enterancePoint, function() {
    this.echo(this.getTitle());
});

// fill in the form and submit it
casper.then(function() {
    this.fill('form.common-login-form', {
        'data[User][email]': settings.user.email,
        'data[User][password]': settings.user.password
    }, true);
});

// Show errors or set the cookie
casper.then(function() {
    if(this.exists('.common-login-response.alert-error')) {    
        var message = 'There are errors on the page.\n';
        message += this.fetchText('.common-login-response.alert-error');
        
        this.echo(message, 'WARNING');
        this.exit();
    } else {
        this.echo('logging in.', 'SUCCESS');
        // fs.write(settings.cookieFileName, cookies, 644);

    }

});

// forward the user to the home page dosent work
//casper.thenOpen('http://dev.teachcycle.com', function() {});

// the selector now exists never gets here
casper.waitForSelector('.tc__headline-1', function() {
    var pageHeadline = this.fetchText('.tc__headline-1');
    this.echo('title = ' + pageHeadline);
});

// url changed nope
casper.then(function() {
    casper.waitForUrlChange(function() {
        this.echo('URL changed:');
        this.echo(this.getCurrentUrl());
    });

    
});

casper.run();