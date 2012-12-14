var casper = require("casper").create({
    verbose: true,
    logLevel: "warning",
    pageSettings: {
        localToRemoteUrlAccessEnabled: true
    }
});


// go to home page
casper.start("http://www.elmar.nl/");

// select first last minute
casper.thenClick("#ul-Lastminutes li:nth-child(2) h4 > a");

casper.then(function() {
//    this.test.assertTitle('Hotel Avenida, Benidorm, Spanje | Elmar.nl');
    this.test.assertTitle("Hotel Del Mar, Barcelona, Spanje | Elmar.nl");
    this.test.assertSelectorHasText(".tab.active", "Omschrijving");
    this.test.assertNotVisible("#traveloptions\\:tripDate");
});

// select price tab
casper.thenClick("#prijzen", function() {
    this.test.assertVisible("#traveloptions\\:tripDate");
});

// click go ahead button
casper.thenClick("#dateList .selected a", function() {
    this.waitUntilVisible("#checkAvailability");
});

casper.waitWhileVisible("#checkAvailability", function then() {}, function onTimeout() {}, 10*1000);

// book it
casper.then(function() {
    this.test.assertVisible("#bookItButton");
});

casper.thenClick("#bookItButton", function() {
    this.waitUntilVisible("#checkAvailability");
});

casper.waitWhileVisible("#checkAvailability");

// fill travel details form and submit
casper.then(function() {
    this.fill("#bookingForm", {
        "bookingForm:adult1title:adult1": "MALE",
        "bookingForm:adult1firstName:adult1": "Adult One First Name",
        "bookingForm:adult1lastName:adult1": "Adult One Last Name",
        "bookingForm:adult1dob:adult1": "01-01-1950",
        "bookingForm:postCodeDecorate:postCode": "1016 BV",
        "bookingForm:houseNumberDecorate:houseNumber": "258",
        "bookingForm:streetDecorate:street": "Herengracht",
        "bookingForm:cityDecorate:city": "Amsterdam",
        "bookingForm:daytimePhoneNumberDecorate:daytimePhoneNumber": "1234567890",
        "bookingForm:emailAddressDecorate:emailAddress": "akazlou@elmar.nl",

        "bookingForm:adult2title:adult2": "MALE",
        "bookingForm:adult2firstName:adult2": "Adult Two First Name",
        "bookingForm:adult2lastName:adult2": "Adult Two Last Name",
        "bookingForm:adult2dob:adult2": "02-02-1951",

        "bookingForm:fullNameDecorate:fullName": "Full Name",
        "bookingForm:telephoneDecorate:telephone": "0987654321"
    });
    this.capture("travel-details-form.png");

    this.click("#bookingForm\\:nextbutton");
});

// wait for insurance page
casper.waitFor(function check() {
    this.echo("Waiting for insurance page!");
    this.echo("Current URL is: " + this.getCurrentUrl());

    return this.getCurrentUrl().indexOf("insurance") !== -1;
}, function then() {
}, function timeout() {
    this.die("Waited too long for insurance page!");
});

casper.then(function() {
    this.test.assertSelectorHasText(".stap .heading3", "Stap 2.Verzekeringen");
});

// go to step 3
casper.thenClick("#bookingForm\\:nextbutton");

// wait for overview overview
casper.waitFor(function check() {
    this.echo("Waiting for insurance page!");
    this.echo("Current URL is: " + this.getCurrentUrl());

    return this.getCurrentUrl().indexOf("overview") !== -1;
}, function then() {
}, function timeout() {
    this.die("Waited too long for insurance page!");
});

casper.then(function() {
    var stepText = this.fetchText("#bookingForm .heading3").replace(/\s+/g, '');
    this.echo("Step text is: " + stepText);
    this.test.assert(stepText === "Stap3.Overzicht");
});

casper.then(function() {
    this.fill("#bookingForm", {
        "bookingForm:bookingCondition": true,
        "bookingForm:travelCondition": true
    });

    // go to step 4
    this.click("#bookingForm\\:nextbutton");
});

casper.then(function() {
    var stepText = this.fetchText("#bookingForm .heading3").replace(/\s+/g, '');
    this.echo("Step text is: " + stepText);
    this.test.assert(stepText === "Stap4.Betalingswijze");

    // go to ogone
    this.click("#bookingForm\\:nextbutton");

    this.waitUntilVisible("#checkAvailability");
});

casper.waitWhileVisible("#checkAvailability", function then() {}, function onTimeout() {}, 20*1000);

casper.then(function() {
    this.test.assert(this.getCurrentUrl() === "https://secure.ogone.com/ncol/prod/orderstandard.asp");
});

casper.then(function() {
    this.capture("lastpage.png");
});

casper.on("url.changed", function(url) {
    this.echo(url);
});

casper.run();