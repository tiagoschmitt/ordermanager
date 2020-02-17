<template>
    <div>
        <h2>{{$route.params.campaignId}} - Details</h2>

        <b-table striped hover :items="items" :fields="fields" :busy="loading">
            <template v-slot:table-busy>
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                </div>
            </template>
            <template v-slot:cell(inventory)="row">
                <b-button v-if="!row.item.inventory.editing"
                    @click="editIventory(row.item)"
                    class="mr-2"
                >{{row.item.inventory.value}}</b-button>

                <div v-if="row.item.inventory.editing">
                    <b-form-input class="w-25" v-if="row.item.inventory.editing" v-model="inventory" :placeholder="row.item.inventory.value"></b-form-input>
                    <b-button @click="cancelEdit(row.item)" variant="danger">Cancel</b-button>
                    <b-button @click="updateIventory(row.item)" variant="success">Update</b-button>
                </div>
            </template>
        </b-table>
        <b-button @click="goToHome">Back to Home</b-button>
    </div>
    
</template>

<script>

import axios from 'axios';

export default {
    props: ['campaignId'],
    name: "details",

    data() {
        return {
            loading: true,
            fields:[
                "product_id",
                "product_name",
                "promotion_name",
                "total_revenue",
                "total_sold",
                "inventory",
            ],
            items: [],
            inventory: 0
        };
    },
    mounted() {
        axios.get(this.$store.state.urls.listProducts, {
            params: {
                campaignId: this.$route.params.campaignId
            }
        }).then((response) => {
            this.items = response.data;
            this.loading = false;
        });
    },
    methods: {
        goToHome() {
            this.$router.push('/');
        },

        editIventory(item) {
            item.inventory.editing = true;
        },

        cancelEdit(item) {
            item.inventory.editing = false;
        },

        updateIventory(item) {
            this.loading = true;
            item.inventory.editing = false;

            axios.get(this.$store.state.urls.updateIventory, {
                params: {
                    productId: item.product_id,
                    inventory: this.inventory
                }
            }).then(() => {
                item.inventory.value = this.inventory;
                this.loading = false;
            });
        }
    }
};
</script>