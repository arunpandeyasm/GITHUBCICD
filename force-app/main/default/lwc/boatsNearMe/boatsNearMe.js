import {LightningElement,wire,api } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import LATITUTED_FIELD from '@salesforce/schema/Boat__c.Geolocation__c';
import LONGITUDE_FIELD from '@salesforce/schema/Boat__c.Geolocation__c';
import NAME_FIELD from '@salesforce/schema/BoatType__c.Name';
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
 let i=0;
export default class BoatsNearMe extends LightningElement {
    @api boattypeid='';
    mapMarkers = [];
    isLoading = true;
    isRendered = false;
    latitude;
    longitude;
    MapMakerString='';
    boatData;
    
    renderedCallback() {       
            if (navigator.geolocation) {           
                    navigator.geolocation.getCurrentPosition(position => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;                                 
                });           
            }
    }


    @wire(getBoatsByLocation,{latitude:'$latitude',longitude:'$longitude',boatTypeId:'$boattypeid'})
    wiredBoatsJSON({error,data}){
        if(data) {
        this.boats=data;
        console.log('data ==> '+JSON.stringify(data));
        
        this.createMapMarkers(data);
    }
    else if(error) {
        this.error = error;
        console.log('data ==> '+JSON.stringify(error));
    }
  }
    
    createMapMarkers(data) {
            this.mapMarkers=JSON.parse(data);
            console.log('<><><>'+this.mapMarkers);            
      }
}