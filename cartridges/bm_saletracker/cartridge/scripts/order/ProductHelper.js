'use strict';

var OrderMgr = require("dw/order/OrderMgr");
var ProductInventoryMgr = require("dw/catalog/ProductInventoryMgr");
var collections = require('~/cartridge/scripts/util/collections');
var formatCurrency = require('*/cartridge/scripts/util/formatting').formatCurrency;
        
/**
 * @module ProductHelper
 */


/**
 * Update the product inventory
 */
function updateIventory(productId, quantity) {
    var Transaction = require('dw/system/Transaction');
    
    try {
        Transaction.wrap(function() {
            ProductInventoryMgr.inventoryList.getRecord(productId).setAllocation(quantity)
        });

        return true;
    } catch (e) {
        return false;
    }
}

/**
 * prepare data do be listed into the Product View
 */
 function prepareData(campaignId) {
    var customerOrders = OrderMgr.searchOrders(
        'custom.specialSaleCampaign != {0}',
        'creationDate desc',
        null
    );

    var customerOrder;
    var allProductLineItems;
    var products = {};
    var product;
    var promotion;
    var row;
    var currency;

    while (customerOrders.hasNext()) {
        customerOrder = customerOrders.next();
        currency = customerOrder.getCurrencyCode();
        allProductLineItems = customerOrder.allProductLineItems;
        
        collections.forEach(allProductLineItems, function (pli) {
            if (isInSpecialCampaign(pli, campaignId)) {
                product = pli.product;
                promotion = getPromotion(pli);
                row = products[pli.productID];

                if (empty(row)) {
                    products[pli.productID] = {
                        "product_id": pli.productID,
                        "product_name": product.name,
                        "promotion_name": promotion.name,
                        "total_revenue": pli.adjustedNetPrice.getValue(),
                        "total_sold": 1,
                        "inventory": { editing: false, value: ProductInventoryMgr.inventoryList.getRecord(pli.productID).ATS.value }
                    }
                } else {
                    row["total_revenue"] += pli.adjustedNetPrice.getValue();
                    row["total_sold"] += 1;
                }
            }
        });
    }

    var keys = Object.keys(products);
    var result = [];

    for (var key in keys) {
        result.push({
            "product_id": products[keys[key]].product_id,
            "product_name": products[keys[key]].product_name,
            "promotion_name": products[keys[key]].promotion_name,
            "total_revenue": formatCurrency(products[keys[key]].total_revenue, currency),
            "total_sold": products[keys[key]].total_sold,
            "inventory": products[keys[key]].inventory,
        });
    }
    
    return result;
}

function isInSpecialCampaign(pli, campaignId) {
    var isSpecialCampgaign;

    collections.forEach(pli.priceAdjustments, function (adjusment) {
        if (adjusment.campaign.custom.isSpecialSale && adjusment.campaign.ID == campaignId) {
            isSpecialCampgaign = true;
            return;
        }
    });

    return isSpecialCampgaign;
}

function getPromotion(pli) {
    var promo;

    collections.forEach(pli.priceAdjustments, function (adjusment) {
        if (adjusment.campaign.custom.isSpecialSale) {
            promo = adjusment.promotion;
            return;
        }
    });

    return promo;
}

/*
 * Module exports
 */
module.exports = {
    prepareData: prepareData,
    updateIventory: updateIventory
};