import { LightningElement,wire,api} from 'lwc';
import BoatMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { subscribe,unsubscribe, APPLICATION_SCOPE,MessageContext } from 'lightning/messageService';
import {getRecord} from 'lightning/uiRecordApi';
import LATITUTED_FIELD from '@salesforce/schema/Boat__c.Geolocation__c';
import LONGITUDE_FIELD from '@salesforce/schema/Boat__c.Geolocation__c';
const BOAT_FIELDS = ['Boat__c.Geolocation__Longitude__s','Boat__c.Geolocation__Latitude__s'];

// Declare the const LONGITUDE_FIELD for the boat's Longitude__s
// Declare the const LATITUDE_FIELD for the boat's Latitude
// Declare the const BOAT_FIELDS as a list of [LONGITUDE_FIELD, LATITUDE_FIELD];
export default class BoatMap extends LightningElement {
  // private
  subscription = null;
  @api boatId;

  // Getter and Setter to allow for logic to run on recordId change
  // this getter must be public
  @api
 get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.setAttribute('boatId', value);
    this.boatId = value;
    console.log('<><><>set'+this.boatId);
  }

  error = undefined;
  mapMarkers = [];

  // Initialize messageContext for Message Service
  @wire(MessageContext)
    messageContext;

  // Getting record's location to construct map markers using recordId
  // Wire the getRecord method using ('$boatId')
  @wire(getRecord,{recordId: '$boatId', fields:BOAT_FIELDS })
  wiredRecord({ error, data }) {

    console.log('<><><>datadata'+data);
    // Error handling
    if (data) {
      this.error = undefined;
      const longitude = data.fields.Geolocation__Longitude__s.value;
      const latitude = data.fields.Geolocation__Latitude__s.value;
      console.log('<><><>datadata__boatMap'+data);
      this.updateMap(longitude, latitude);
    } else if (error) {
      this.error = error;
      this.boatId = undefined;
      this.mapMarkers = [];
      console.log('<><><>errorerror'+error);
    }
  }

  // Runs when component is connected, subscribes to BoatMC
  connectedCallback() {
    // recordId is populated on Record Pages, and this component
    // should not update when this component is on a record page.
    console.log('<><>< in subscribeToMessageChannel.boatMap');
    if (this.subscription || this.recordId) {
      return;
    }
    this.subscribeToMessageChannel();
  }
  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }   

    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
      console.log('<><>< in subscribeToMessageChannel.boatMap');
      if (!this.subscription) {
          this.subscription = subscribe(
              this.messageContext,BoatMC,
              (message) => this.handleMessage(message),
              { scope: APPLICATION_SCOPE }
          );
      }
      this.subscription = subscribe(
          this.messageContext,
          BoatMC, (message) => {
              this.handleMessage(message);
          });
    }
    unsubscribeToMessageChannel() {
      unsubscribe(this.subscription);
      this.subscription = null;
    }
    handleMessage(message) {
      this.boatId = message.recordId;
      console.log('<><><> In handleMessage'+this.boatId);
    } 
  // Creates the map markers array with the current boat's location for the map.
  updateMap(Longitude, Latitude) {
    console.log('<><><> Longitude'+Longitude);
    console.log('<><><> Latitude'+Latitude);
    this.mapMarkers = [{
      location : {
        Latitude : Latitude,
        Longitude : Longitude
      }
    }];
    console.log('<><><> map'+JSON.stringify(this.mapMarkers));
  }

  // Getter method for displaying the map component, or a helper method.
  get showMap() {
    return this.mapMarkers.length > 0;
  }
}