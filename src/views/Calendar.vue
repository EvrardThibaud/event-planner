<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { loadScript, gapiLoaded } from '../composable/GoogleAuth.js';
  import {addTimeToDateTime, calculTimeMin, calculTimeMax, getDayOfWeek,getDayFromDateTime, getMonthInfo, getSortingTime, daysOfTheWeek, formatToTimeName, stepSortingTime, extractHour} from "../composable/DateTime.js";
  import { createAlert } from '../composable/Alerts.js';
  import Event from '../components/Event.vue';
  import EventCard from '../components/EventCard.vue';
  import FormCreateEvent from '../components/FormCreateEvent.vue';

  const eventLoading = ref(true)
  const isCreating = ref(false)
  const event = ref(null)
  const newParticipant = ref('');
  const isAdding = ref(false);
  const eventsList = ref([]);
  const isConnected = ref(localStorage.getItem('google_access_token') !== null);
  const noEvent = ref(false)
  const participantsList = ref([]);
  const sortingType = ref('daily');
  const sortingTime = ref()
  const newEvent = ref({
        title: '',
        datetime: '',
        time: '01:00',
        location: '',
        description: '',
        attendees: []
    });

  async function listUpcomingEvents() {
    eventsList.value = [];
    noEvent.value = false;
    
    let timeMin = calculTimeMin(sortingTime.value,sortingType.value)
    let timeMax = calculTimeMax(sortingTime.value,sortingType.value)
    let response;

    try {
      const request = {
        calendarId: 'primary',
        timeMin: timeMin,
        timeMax: timeMax,
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);
    } 
    catch (err) {
      createAlert("Try to reconnect on the google auth page","error",undefined,"Undefined tockenClient")
      
      return;
    }

    eventLoading.value = false
    isAdding.value = false;
    
    const events = response.result.items;
    if (!events || events.length === 0) {
      noEvent.value = true;
      return;
    }
      
    const output = events.map(event => ({
      id: event.id,
      summary: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end?.dateTime || event.end?.date || null,
      location: event.location || null, 
      description: event.description || null, 
      attendees: event.attendees || null,
    }));
    eventsList.value.push(...output);
  }

  async function unselectEvent(){
    event.value = null
  }

  async function handleRemoveEventClick(e, id){
    e.target.innerText = 'Deleting...';
    let response;
    try {
      const request = {
        calendarId: 'primary',
        eventId: id
      };
      response = await gapi.client.calendar.events.delete(request);
      if (response.status === 204) {
        listUpcomingEvents();
        event.value = null
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async function handleAddEventClick() {
    isAdding.value = true;

    if (!newEvent.value.datetime || !newEvent.value.time){
      isAdding.value = false;
      return;
    }

    const event = {
      summary: newEvent.value.title,
      location: newEvent.value.location,
      description: newEvent.value.description,
      start: {
        dateTime: newEvent.value.datetime + ':00+01:00',  
        timeZone: 'Europe/London', 
      },
      end: {
        dateTime: addTimeToDateTime(newEvent.value.datetime,newEvent.value.time) + ':00+01:00',  
        timeZone: 'Europe/London',  
      },
      attendees: participantsList.value,
    }
    
    let response;
    try {
      const request = {
        calendarId: 'primary',
        resource: event
      };
      response = await gapi.client.calendar.events.insert(request);
      if (response.status === 200) {
        console.log(response);
        createAlert("Your event named " + newEvent.value.title + " has been added successfully.","success")
        newEvent.value = {
            title: '',
            datetime: '',
            time: '01:00',
            location: '',
            description: '',
            attendees: []
        }
        participantsList.value = [];
        listUpcomingEvents();
        setNewEventDateTime();
        toggleIsCreating();
      }
    } catch (err) {
      isAdding.value = false;
      console.log(err);
      return;
    }
  }

  async function modifyEvent(){
    const eventModified = {
      summary: event.value.summary,
      location: event.value.location,
      description: event.value.description,
      start: {
        dateTime: event.value.start,  
        timeZone: 'Europe/London', 
      },
      end: {
        dateTime: event.value.end,  
        timeZone: 'Europe/London',  
      },
      attendees: event.attendees,
    }
    
    let response;
    try {
      const request = {
        calendarId: 'primary',
        resource: eventModified,
        eventId: event.value.id,
      };
      response = await gapi.client.calendar.events.update(request);
      if (response.status === 204) {

        listUpcomingEvents();
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async function handleAddParticipant(){
    participantsList.value.push({email : newParticipant.value});
    newParticipant.value = '';
  }

  async function handleDeleteParticipantClick(i){
    participantsList.value.splice(i,1);
  }

  async function handleViewMore(e){
    event.value = e
  }

  async function handleChevronClick(step){
    sortingTime.value = stepSortingTime(sortingType.value,sortingTime.value,step)
    listUpcomingEvents()
  }

  async function handleSortingChange(){
    sortingTime.value = getSortingTime(sortingType.value)

    listUpcomingEvents()
  }

  async function setNewEventDateTime(){
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const formattedDateTime = localDate.toISOString().slice(0, 16); 
    newEvent.value.datetime = formattedDateTime;
  }

  async function setSortingTime(){
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const formattedDate = localDate.toISOString().slice(0, 10);
    sortingTime.value = formattedDate;
  }

  async function toggleIsCreating(){
    isCreating.value = !isCreating.value
    document.body.classList.toggle('no-scroll')
  }

  const calendarData = computed(() => {
    const { firstDayIndex, daysInMonth } = getMonthInfo(sortingTime.value);
    const calendar = [];
    let currentDay = 1;
    const firstWeek = Array(7).fill(null).map((_, index) => {
      if (index >= firstDayIndex - 1) {
        return currentDay++;
      }
      return null;
    });
    calendar.push(firstWeek);
    while (currentDay <= daysInMonth) {
      const week = Array(7).fill(null).map(() => {
        if (currentDay <= daysInMonth) {
          return currentDay++;
        }
        return null;
      });
      calendar.push(week);
    }

    return calendar
  })


  onMounted(() => {
    loadScript('https://apis.google.com/js/api.js', () => {
      gapiLoaded(listUpcomingEvents); 
    });
    setNewEventDateTime();
    setSortingTime();
  });
</script>

<template>
  <section v-if="isConnected" id="section_calendar" class="px-4 " >
    <h1 class="text-gray-300 font-bold text-2xl">Calendar</h1>
    
    <div class="flex justify-center">
      <select name="" id="" v-model="sortingType" class="text-gray-800 " @change="handleSortingChange" >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
    </div>
    
    <div v-if="sortingTime && sortingType" class="flex justify-center  pt-4 gap-4 select-none">
      <span class="material-symbols-outlined hover:cursor-pointer active:scale-95 flex items-center" @click="handleChevronClick(-1)">arrow_back_ios</span>
      <input 
        v-model="sortingTime"
        @input="listUpcomingEvents"
        :type="sortingType === 'daily' ? 'date' : 
        sortingType === 'weekly' ? 'week' : 
        sortingType === 'monthly' ? 'month' : ''"
        class="text-gray-400 min-w-fit uppercase font-semibold p-0 bg-zinc-900 "
      >
      <span class="material-symbols-outlined hover:cursor-pointer active:scale-95 flex items-center" @click="handleChevronClick(+1)">arrow_forward_ios</span>
    </div>

    <p v-if="noEvent" class="flex justify-center pt-4 gap-4">
      {{
        sortingType === "daily" ? "You don't have any event this day" :
        sortingType === "weekly" ? "You don't have any event this week" :
        sortingType === "monthly" ? "You don't have any event this month" : "error"
      }}
    </p>

    <table v-if="sortingType === 'monthly'" id="table_event_monthly" >
      <thead>
        <tr>
          <th v-for="day in daysOfTheWeek()" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, weekIndex) in calendarData" :key="weekIndex" >
          <td v-for="(day, dayIndex) in week" :key="dayIndex" >
            <p v-if="day">{{ day }}</p>
            <template v-for="event in eventsList">
              <div
                v-if="getDayFromDateTime(event.start) === day"
                @click="handleViewMore(event)" 
                class="bg-teal-900 rounded-lg m-1 p-1 "
              >
              {{event.summary?event.summary:'Unamed Event'}}
              </div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <table v-else-if="sortingType == 'daily'" id="table_event_daily" v-if="!eventLoading">
      <tr v-for="i in 24">
        <td class="w-14 text-right pr-2 text-xs" >{{ i - 1 <= 11 ? i - 1 + " AM" : i - 1 + " PM" }}</td>
        <td class="second_row">
          <template v-for="event in eventsList">
            <EventCard   
              v-if="extractHour(event.start) === (i-1)"
              :key="event.id" 
              @click="handleViewMore(event)" 
              :event="event"  
            />
          </template>
        </td>
      </tr>
    </table>

    <table v-else-if="sortingType == 'weekly'" id="table_event_weekly">
      <thead>
        <tr>
          <th v-for="day in daysOfTheWeek()">{{ day }}</th>
        </tr>
      </thead>
      <tbody >
        <tr>
          <td class="second_row" v-for="day in daysOfTheWeek()">
            <template v-for="event in eventsList">
              <EventCard
                v-if="event && event.start && getDayOfWeek(event.start) === day"
                :key="event.id"
                @click="handleViewMore(event)"
                :event="event"
                class="my-2"
              />
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <button class="primary_button" id="buttonOpenAddEventForm" @click="toggleIsCreating">
      <div class="flex items-center">
        <span class="material-symbols-outlined">add</span>
        <p>Create a new event</p>
      </div>
    </button>

    <div v-if="eventLoading" class="w-full fixed top-52 right-0 flex items-center justify-center ">
      <div class="loader"  ></div> 
    </div>
  </section>

  <div v-else class="text-gray-200">
    <p>You can't see any calendar because you are not connected</p>
    <RouterLink    :to="{name: 'GoogleAuth'}" >
      <button class="primary_button">Click here to connect.</button>
    </RouterLink>
  </div>

  <FormCreateEvent v-if="isCreating"
    :newEvent="newEvent" 
    :participantsList="participantsList" 
    :isAdding="isAdding"
    v-model:newParticipant="newParticipant"
    @handleAddEventClick="handleAddEventClick"
    @handleAddParticipant="handleAddParticipant"
    @handleDeleteParticipantClick="handleDeleteParticipantClick"
    @toggleIsCreating="toggleIsCreating"
  />

  <Event v-if="event" 
    :event="event" 
    @modifyEvent="modifyEvent" 
    @handleRemoveEventClick="handleRemoveEventClick"
    @unselectEvent="unselectEvent"
  ></Event>
  
</template>

<style scoped lang="scss">
  #section_calendar{
    min-height: calc(100vh - 56px); 
  }

  .grid-cols-auto {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  #buttonOpenAddEventForm{
    position: fixed;
    bottom: 20px;
    left: calc(50vw );
    transform: translateX(-50%); 
    transform-origin: center;
    &:active{
      transform: translateX(-50%) scale(0.98);
    }
  }

  #table_event_daily{
    max-height: 100px;
    overflow: hidden;
    width: 100%;

    .second_row{
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      padding: 4px;
      min-height: 50px;
      border-bottom: white 1px solid;
    }
  }

  #table_event_weekly{

  }

  .loader {
    width: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 8px solid #133c4e;
    animation:
      l20-1 0.8s infinite linear alternate,
      l20-2 1.6s infinite linear;
  }
  @keyframes l20-1{
    0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
    12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
    25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
    50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
    62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
    75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
    100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
  }

  @keyframes l20-2{ 
    0%    {transform:scaleY(1)  rotate(0deg)}
    49.99%{transform:scaleY(1)  rotate(135deg)}
    50%   {transform:scaleY(-1) rotate(0deg)}
    100%  {transform:scaleY(-1) rotate(-135deg)}
  }

  #table_event_monthly {
    width: 100%;
    table-layout: fixed;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 100px;
    
    thead tr th {
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      font-size: 1.2vw;
    }
    
    tbody tr {
      border-bottom: 1px solid rgba(255, 255, 255, 0.5);

      td {
        border: 1px solid rgba(255, 255, 255, 0.5);
        vertical-align: top;
        text-align: left;
        padding: 5px;

        div {
          background-color: #134c5f;
          color: #fff;
          border-radius: 5px;
          margin: 2px 0;
          padding: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          &:hover {
            opacity: .9;
          }
        }

        p {
          font-size: 0.9rem;
          font-weight: bold;
          margin-bottom: 5px;
        }

      }
    }
  }

  #table_event_weekly {
    table-layout: fixed; 
    width: 100%;
    border-collapse: collapse;

    thead {
      font-weight: bold;

      th {
        padding: 10px;
        text-align: center;
        text-transform: uppercase;
        font-size: 1.2vw;
      }
    }

    td {
      padding: 10px;
      text-align: center;
      vertical-align: top;
      border-right: 1px solid #e0e0e0;
      border-left: 1px solid #e0e0e0;
      
      &:first-child {
        border-left: none;  /* Retirer la bordure gauche du premier <td> */
      }
  
      &:last-child {
        border-right: none;  /* Retirer la bordure droite du dernier <td> */
      }
    }
  }



</style>
