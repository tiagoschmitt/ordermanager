<template>
    <div>
        <h1>Sales Tracker</h1>
        <b-table striped hover :fields="fields" :items="items">
            <template v-slot:cell(customers)="row">
                <b-button
                    size="sm"
                    @click="showCustomers(row.index)"
                    class="mr-2"
                >{{row.item.customers.length}}</b-button>
            </template>
            <template v-slot:cell(details)="row">
                <b-button size="sm" @click="showDetails(row.item.campaign_id)" class="mr-2">Details</b-button>
            </template>
        </b-table>
    </div>
</template>

<script>
import moment from "moment";

export default {
    name: "campaign",

    data() {
        return {
            fields: [
                "campaign_id",
                "lead",
                {
                    key: "last_modified",
                    formatter: value => {
                        return moment(String(value)).format("MM/DD/YYYY");
                    }
                },
                "customers",
                "total_revenue",
                "details"
            ],
            items: this.$store.state.campaignsData
        };
    },
    methods: {
        showCustomers(index) {
            this.$router.push({ name: "Customers", params: { "index": index } });
        },
        showDetails(campaignId) {
            this.$router.push({ name: "Details", params: { campaignId: campaignId } });
        }
    }
};
</script>