<template>
    <div id="container">
        <objectPrivilege></objectPrivilege>
    </div>
</template>

<script>
    import objectPrivilege from "./objectPrivilege.vue";
    
    export default {
        name: 'common',

        components: {
            objectPrivilege:objectPrivilege
        }
    }
</script>

