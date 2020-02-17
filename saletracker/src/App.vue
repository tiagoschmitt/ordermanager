<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    /**
     * Before Create, get the initial Data
     */
    beforeCreate() {
        var campaignsData  = JSON.parse(document.getElementById("campaignsData").value);
        var urls  = JSON.parse(document.getElementById("urls").value);

        this.$store.state.campaignsData = campaignsData;
        this.$store.state.urls = urls;
    }
}
</script>
