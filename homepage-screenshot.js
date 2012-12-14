var casper = require("casper").create();

casper.start("http://www.elmar.nl/", function() {
    this.capture("homepage.png");
});

casper.run();