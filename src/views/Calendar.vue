<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import { loadScript, gapiLoaded } from '../composable/GoogleAuth.js';
  import {calculTimeMin, calculTimeMax, getDayOfWeek, isTodayMonthly, getDayFromDateTime, isTodayWeekly, getDateFromWeek, getDayNumberFromWeek, getMonthInfo, getSortingTime, daysOfTheWeek, formatToTimeName, stepSortingTime, extractHour} from "../composable/DateTime.js";
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
  const sortingType = ref();

  const sortingTime = ref()
  const newEvent = ref({
        title: '',
        datetime_start: '',
        datetime_end: '',
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
      createAlert("Try to reconnect on the profile page","error",undefined,"Undefined tockenClient")
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
      attendees: event.attendees || [],
    }));
    eventsList.value.push(...output);
  }

  async function unselectEvent(){
    event.value = null
    document.body.classList.toggle('no-scroll')
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
        eventsList.value = eventsList.value.filter(event => event.id !== id);
        event.value = null
        createAlert("The event have been deleted",'success')
      }
    } catch (err) {
      console.log(err);
      e.target.innerText = 'Delete this event';
      createAlert("Failed to delete the event. Try to reload the page.",'error')
      return;
    }
  }

  async function handleAddEventClick() {
    isAdding.value = true;

    if (!newEvent.value.datetime_start || !newEvent.value.datetime_end){
      isAdding.value = false;
      return;
    }

    const event = {
      summary: newEvent.value.title,
      location: newEvent.value.location,
      description: newEvent.value.description,
      start: {
        dateTime: newEvent.value.datetime_start + ':00+01:00',  
        timeZone: 'Europe/London', 
      },
      end: {
        dateTime: newEvent.value.datetime_end + ':00+01:00',  
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
        createAlert("Your event named " + newEvent.value.title + " has been added successfully.","success")
        newEvent.value = {
            title: '',
            datetime_start: '',
            datetime_end: '01:00',
            location: '',
            description: '',
            attendees: []
        }
        participantsList.value = [];

        listUpcomingEvents()
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
      attendees: event.value.attendees,
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
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(newParticipant.value)) {
        createAlert('Please enter a valid email address.','error');
        return;
      }
      participantsList.value.push({ email: newParticipant.value });
      newParticipant.value = '';
  }

  async function handleDeleteParticipantClick(i){
    participantsList.value.splice(i,1);
  }

  async function handleViewMore(e){
    event.value = e
    document.body.classList.toggle('no-scroll')
  }

  async function handleChevronClick(step){
    sortingTime.value = stepSortingTime(sortingType.value,sortingTime.value,step)
    listUpcomingEvents()
  }

  async function handleSortingChange(){
    sortingTime.value = getSortingTime(sortingType.value)
    listUpcomingEvents()
  }

  async function handleDateClick(day){
    let newSortingTime = ''
    if (sortingType.value === 'monthly') {
      const [year, month] = sortingTime.value.split('-');
      newSortingTime = `${year}-${month}-${String(day).padStart(2, '0')}`;
    }
    else if (sortingType.value === 'weekly') {
      newSortingTime = getDateFromWeek(day,sortingTime.value)
    } 
    
    sortingType.value = 'daily';
    sortingTime.value = newSortingTime
    listUpcomingEvents()

  }

  async function handleTodayClick(){
    sortingTime.value = getSortingTime(sortingType.value)
    listUpcomingEvents() 
  }

  async function setNewEventDateTime(){
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const formattedDateTime = localDate.toISOString().slice(0, 16); 
    newEvent.value.datetime_start = formattedDateTime;
    newEvent.value.datetime_end = formattedDateTime;
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
 
  const screenWidth = ref(window.innerWidth);

  // Recalculer la taille de l'écran lors du redimensionnement
  window.addEventListener('resize', () => {
    screenWidth.value = window.innerWidth;
  });

  // Fonction pour tronquer le texte en fonction de la largeur de l'écran
  const truncatedDay = (day) => {
    if (screenWidth.value < 600) {
      return day.substring(0, 3); // Limite à 3 caractères si l'écran est plus petit que 600px
    }
    return day; // Affiche le texte complet sinon
  };

  watch(sortingType, (newValue) => {
    localStorage.setItem('sorting_type', newValue);
  });

  onMounted(() => {
    loadScript('https://apis.google.com/js/api.js', () => {
      gapiLoaded(listUpcomingEvents); 
    });

    if (localStorage.getItem('sorting_type') === null) {
      localStorage.setItem('sorting_type', 'daily');
    } else{
      sortingType.value = localStorage.getItem('sorting_type')
    }

    setNewEventDateTime();

    sortingTime.value = getSortingTime(sortingType.value)
  });
</script>

<template>
  <h1 class="text-gray-300 font-bold text-2xl w-full px-4">Calendar</h1>
  <section v-if="isConnected" id="section_calendar" class="px-4 w-full" >
    
    <div class="flex justify-center">
      <select name="" id="" v-model="sortingType" class="text-zinc-900 " @change="handleSortingChange" >
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
      You don't have any event this 
      {{
        sortingType === "daily" ? " day" :
        sortingType === "weekly" ? " week" :
        sortingType === "monthly" ? " month" : "error"
      }}
    </p>

    <div v-if="eventLoading" class="w-full fixed top-52 right-0 flex items-center justify-center ">
      <div class="loader"  ></div> 
    </div>

    <table v-else-if="sortingType === 'monthly'" id="table_event_monthly" >
      <thead>
        <tr>
          <th v-for="day in daysOfTheWeek()" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, weekIndex) in calendarData" :key="weekIndex" >
          <td v-for="(day, dayIndex) in week" 
            :key="dayIndex" 
            :class="{ 'hover:bg-zinc-800 cursor-pointer': day }"
            @click="day && handleDateClick(day)"
          >
            <p v-if="day"  :class="{'bg-green-200  size-5 flex justify-center items-center rounded-full text-zinc-900' : isTodayMonthly(sortingTime,day)}">
              {{ day }}
            </p>
            <template v-for="event in eventsList">
              <div
                v-if="getDayFromDateTime(event.start) === day"
                @click.stop="handleViewMore(event)"  
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
      <tbody >
        <tr>
          <td 
            v-for="day in daysOfTheWeek()" 
            @click="handleDateClick(day)"
            class="hover:bg-zinc-800 cursor-pointer" 
          >
          <p :class="{'bg-green-200   flex justify-center items-center rounded-full text-zinc-900' : isTodayWeekly(sortingTime,day)}">
            {{ truncatedDay(day) }}
            {{ getDayNumberFromWeek(day,sortingTime) }}
          </p>
            <template v-for="event in eventsList">
              <EventCard
                v-if="event && event.start && getDayOfWeek(event.start) === day"
                :key="event.id"
                @click.stop="handleViewMore(event)"
                :event="event"
                class="my-2"
              />
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="buttonCalendarePageFixed">
      <button class=" primary_button" @click="toggleIsCreating">
        <div class="flex items-center">
          <span class="material-symbols-outlined">add</span>
          <p>Create a new event</p>
        </div>
      </button>
      
      <button  class=' secondary_button' :disabled="getSortingTime(sortingType) === sortingTime" @click="handleTodayClick">
        Today
      </button>
    </div>
      
    
  </section>

  <div v-else class="text-gray-200 p-14 flex flex-col gap-4">
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

  .buttonCalendarePageFixed{
    position: fixed;
    right: 12px;
    top: 90px;
    display: flex;
    align-items: end;
    flex-direction: column

    p {
      display: block;
    }

    @media (max-width: 600px) {
      p {
        display: none;
      }
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
            background-color: #134c5f76;
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
    
    td {
      
      p{
        font-weight: bold;
        text-transform: uppercase;
        font-size: 1.2vw;
      }

      #today{
        font-weight: 400;
        font-size: 14px;
        text-transform: none;
      }

      padding: 10px;
      text-align: center;
      vertical-align: top;
      border-right: 1px solid #e0e0e0;
      border-left: 1px solid #e0e0e0;

      @media (max-width: 600px) {
          padding: 10px 0 0 0;

          p{
            font-size: x-small;
          }
      }
      
      &:first-child {
        border-left: none;  
      }
  
      &:last-child {
        border-right: none;  
      }
    }
  }



</style>
