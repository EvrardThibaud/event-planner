<script setup>
    import { defineProps, ref } from 'vue'
    import { formatEventDateTimes } from '../composable/DateTime';
    
    const props = defineProps({
        event : Object
    })
</script>

<template>
    <div id="eventCard" >
        
        <p class="text-lg font-medium " >{{ props.event.summary ? props.event.summary : 'Unamed Event' }}</p>
        <p class="text-sm" v-for="(text, i) in formatEventDateTimes(props.event.start,event.end)" :key="i" >
             {{text}}
        </p>
    </div>

</template>

<style scoped>
    #eventCard {
        max-width: 100%;
        user-select: none;
        color: white;
        background-color: #133c4e;
        padding: 6px;
        cursor: pointer;
        border-radius: 10px;
        overflow: hidden;

        p {
            max-width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        &:hover {
            background-color: #133c4e76;
        }
    }

    #eventCard {
    max-width: 100%;
    user-select: none;
    color: white;
    background-color: #133c4e;
    padding: 6px;
    cursor: pointer;
    border-radius: 10px;
    overflow: hidden;

    p {
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;

    }
    
    .text-lg::before{
        content: '📋';
    }

    .text-sm::before{
        content: '⏰';
    }

    &:hover {
        background-color: #133c4e76;
    }
}

/* Pour les petits écrans (moins de 600px), on masque les dates */
@media (max-width: 768px) {
    #eventCard p.text-sm {
        display: none;
    }

    #eventCard p.text-lg {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: small;
        font-weight: normal;
    }

    #eventCard p.text-lg::before {
        content: ''; 
    }
}


</style>
