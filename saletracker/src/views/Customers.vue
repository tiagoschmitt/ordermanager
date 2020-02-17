<template>
    <div>
        <h1>{{$store.state.campaignsData[$route.params.index]["campaign_id"]}} - Customers</h1>
        <b-table striped hover :items="customers"></b-table>
        <b-button @click="goToHome">Back to Home</b-button>
    </div>
</template>

<script>
export default {
    name: "Customers",
    props : ["index"],

    computed: {
        customers() {
            return this.$store.state.campaignsData[this.$route.params.index].customers;
        }
    },
    methods: {
        goToHome() {
            this.$router.push('/');
        }
    }
};
</script>