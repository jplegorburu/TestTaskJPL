"use strict";

var Steps = require("glace-js").Steps;
var Page = require("glace-js").Page;

// Main Page
var indexPage = new Page(
    "index", "",
    { 
        searchField: "input#testdata",
        searchButton: "input#spinButton",
        coinBalance: "input#balance-value",
        winLabel: "div#winbox",
        middleRow: "div.notch.notch2"
    });

Steps.register({
    goToURL: async function () {
        await this.openPage(indexPage.name);
    },
    spinWheel: async function (text) {
        await indexPage.searchField.getElement().setValue(text);
        await indexPage.searchButton.getElement().click();
        await this.pause(1, "wait for result");
    },
    getResult: async function () {
        return await indexPage.winLabel.getText();
    },
    getCoinBalance: async function () {
        return await indexPage.coinBalance.getElement().getValue();
    },
    setCoinBalance: async function (text) {
        return await indexPage.coinBalance.getElement().setValue(text);
    },
    isSpinButtonEnabled: async function () {
        return await indexPage.searchButton.getElement().isEnabled();
    }
});

// Tests
test("Not winning test", () => {

    before(async() => {
        $.registerPages(indexPage);
        await $.restartBrowser();
    });

    chunk("When the input is 12345 it should lose 1 Coin", async () => {
        await $.goToURL();
        var actualCoins;
        await $.getCoinBalance().then(function(result) {
            actualCoins = +result;
        });
        await $.spinWheel("12345");
        await $.getCoinBalance().then(function(coins) {
            expect(+coins).to.be.equal(actualCoins-1);
        });
    });

    chunk("When the coin balance is 0 spin button should be blocked", async () => {
        await $.goToURL();
        var actualCoins;
        await $.setCoinBalance(0);
        await $.isSpinButtonEnabled().then(function(status) {
            expect(stats).to.be.false;
        });
    });
    
    chunk("When the coin balance is 1 after not winining the spin button should be blocked", async () => {
        await $.goToURL();
        var actualCoins;
        await $.setCoinBalance(1);
        await $.spinWheel("12345");
        await $.getCoinBalance().then(function(coins) {
            expect(+coins).to.be.equal(0);
        });
        await $.isSpinButtonEnabled().then(function(status) {
            expect(stats).to.be.false;
        });
    });
});

var testSet = require('./winTests.json');

test("Wining coins tests", () => {

    before(async() => {
        $.registerPages(indexPage);
        await $.restartBrowser();
    });

    testSet.forEach(tc => {
        chunk("When the input is "+ tc.testInput+ " it should win " + tc.expectedCoins + " Coins", async () => {
            await $.goToURL();
            var actualCoins;
            await $.getCoinBalance().then(function(result) {
                actualCoins = +result;
            });
            await $.spinWheel(tc.testInput);
            await $.getCoinBalance().then(function(coins) {
                expect(+coins).to.be.equal(actualCoins+Number.parseInt(tc.expectedCoins)-1);
            });
            await $.getResult().then(function(result) {
                expect(result).to.be.equal('Win '+tc.expectedCoins+' coins');
            });
        });
    });
    

});

var invalidTest=require('./wrongInputTests.json');

test("Invalid input tests", () => {

    before(async() => {
        $.registerPages(indexPage);
        await $.restartBrowser();
    });

    invalidTest.forEach(tc => {
        chunk("When the input is "+ tc.testInput+ " it should show error message and do not consume coins ", async () => {
            await $.goToURL();
            var actualCoins;
            await $.getCoinBalance().then(function(result) {
                actualCoins = +result;
            });
            await $.spinWheel(tc.testInput);
            await $.getCoinBalance().then(function(coins) {
                expect(+coins).to.be.equal(actualCoins);
            });
            //await $.getResult().then(function(result) {
            //    expect(result).to.be.equal('Invalid Input');
            //});
        });
    });
    

});