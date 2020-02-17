'use strict';

var OrderMgr = require("dw/order/OrderMgr");
var PromotionMgr = require("dw/campaign/PromotionMgr");
var formatCurrency = require('*/cartridge/scripts/util/formatting').formatCurrency;

/**
 * @module CampaignHelper
 */

/**
 * prepare data do be listed into the Campaign View
 * @param {dw.order.Order} order - Special Order
 */
 function prepareData() {
    var customerOrders = OrderMgr.searchOrders(
        'custom.specialSaleCampaign != {0}',
        'creationDate desc',
        null
    );

    var campaigns = {};
    var customerOrder;
    var campaignId;
    var campaign;
    var row;
    var customer;
    var customerName;
    var currency;

    while (customerOrders.hasNext()) {
        customerOrder = customerOrders.next();
        currency = customerOrder.getCurrencyCode();
        campaignId = customerOrder.custom.specialSaleCampaign;
        campaign = PromotionMgr.getCampaign(campaignId);
        row = campaigns[campaignId];
        customer = customerOrder.getCustomer();
        customerName = customer.profile.getFirstName() + " " + customer.profile.getLastName();

        if (empty(row)) {
            campaigns[campaignId] = {
                "campaign_id": campaignId,
                "lead": campaign.custom.userId,
                "last_modified": campaign.getLastModified(),
                "customers": [{ "name": customerName, "total": customerOrder.adjustedMerchandizeTotalNetPrice.getValue()}],
                "total_revenue": customerOrder.adjustedMerchandizeTotalNetPrice.getValue(),
            }
        } else {
            row["last_modified"] = campaign.getLastModified()
            row["total_revenue"] += customerOrder.adjustedMerchandizeTotalNetPrice.getValue();

            var localCustomer = getCustomer(row["customers"], customerName);

            if (localCustomer) {
                localCustomer["total"] += customerOrder.adjustedMerchandizeTotalNetPrice.getValue();
            } else {
                row["customers"].push({ "name": customerName, "total": customerOrder.adjustedMerchandizeTotalNetPrice.getValue()})
            }

        }
    }

    var keys = Object.keys(campaigns);
    var result = [];

    for (var key in keys) {
        result.push({
            "campaign_id": campaigns[keys[key]].campaign_id,
            "lead": campaigns[keys[key]].lead,
            "last_modified": campaigns[keys[key]].last_modified,
            "customers": campaigns[keys[key]].customers,
            "total_revenue": formatCurrency(campaigns[keys[key]].total_revenue, currency),
        });
    }

    for (var i = 0; i < result.length; i++) {
        for (var j = 0; j < result[i].customers.length; j++) {
            result[i].customers[j].total = formatCurrency(result[i].customers[j].total, currency);
        }
        
    }
    
    return result;
}

function getCustomer(customers, name) {
    for (var customer in customers) {
        if (customer.name == name) {
            return customer;
        }
    }

    return null;
}

/*
 * Module exports
 */
module.exports = {
    prepareData  : prepareData
};