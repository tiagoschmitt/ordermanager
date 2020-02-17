"use strict";

/* Script Modules */
var app = require("~/cartridge/scripts/app");
var guard = require("~/cartridge/scripts/guard");
var CampaignHelper = require("~/cartridge/scripts/order/CampaignHelper");
var ProductHelper = require("~/cartridge/scripts/order/ProductHelper");
var r = require("~/cartridge/scripts/util/Response");


/**
 * Renders the general track order page.
 */
function show() {
    var campaigns = CampaignHelper.prepareData();

    app.getView({
        campaigns: JSON.stringify(campaigns)
    }).render("trackorder");
}

function listProducts() {
    var campaignId = request.httpParameterMap.campaignId.stringValue;
    var products = ProductHelper.prepareData(campaignId);
    r.renderJSON(products);
}

function updateIventory() {
    var productId = request.httpParameterMap.productId.stringValue;
    var quantity = request.httpParameterMap.inventory.intValue;
    
    r.renderJSON({
        success: ProductHelper.updateIventory(productId, quantity)
    });
}

/** Render the campaign page.
 * @see {@link module:controllers/TrackOrder~show} */
exports.Show = guard.ensure(["get", "https"], show);

/* @see {@link module:controllers/TrackOrder~ListProducts} */
exports.ListProducts = guard.ensure(["get", "https"], listProducts);

/* @see {@link module:controllers/TrackOrder~UpdateIventory} */
exports.UpdateIventory = guard.ensure(["get", "https"], updateIventory);

