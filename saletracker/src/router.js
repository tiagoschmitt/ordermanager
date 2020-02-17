import Vue from 'vue'
import Router from 'vue-router'
import Campaign from './views/Campaign.vue'
import Customers from './views/Customers.vue'
import Details from './views/Details.vue'

Vue.use(Router)

var routes = [{
        path      : '/',
        name      : 'Campaign',
        component : Campaign
    },
    {
        path      : '/customers/:index',
        name      : 'Customers',
        component : Customers
    },
    {
        path      : '/details/:campaignId',
        name      : 'Details',
        component : Details
    }
];

export default new Router({
  mode   : 'abstract',
  routes : routes
})
