import { LightningElement,wire,api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import Picture_Field from '@salesforce/schema/Boat__c.Picture__c';
import Name_Field from '@salesforce/schema/Boat__c.Name';
import Contact_Field from '@salesforce/schema/Boat__c.Contact__c';
import Price_Field from '@salesforce/schema/Boat__c.Price__c';
import BoatType_Field from '@salesforce/schema/Boat__c.BoatType__c';
import Length_Field from '@salesforce/schema/Boat__c.Length__c';

const fields = [Picture_Field,Name_Field,Contact_Field,Price_Field,BoatType_Field,Length_Field];
const TILE_WRAPPER_SELECTED_CLASS = "tile-wrapper selected";
const TILE_WRAPPER_UNSELECTED_CLASS = "tile-wrapper";
export default class BoatTile extends LightningElement {
   
    messageContext;

    @api boatid;
    selectedBoatId;
    
    // Getter for dynamically setting the background image for the picture
    @wire(getRecord, { recordId: '$boatid', fields })
    boat;
    
    get backgroundStyle() { 
      //console.log("<><><><><"+JSON.stringify(this.boat.data));
    const a = 'background-image: url('+'\''+ getFieldValue(this.boat.data, Picture_Field)+'\''+')';
    console.log(a);
    return a;
    }
    get name() {
      return getFieldValue(this.boat.data, Name_Field);
    }
    get OwnerName() {
      return getFieldValue(this.boat.data, 'Contact__c.Name');
    }
    get price() {
      return getFieldValue(this.boat.data, Price_Field);
    }
    get BoatType() {
      return getFieldValue(this.boat.data, 'BoatType__c.Name');
    }
    get length() {
      return getFieldValue(this.boat.data,Length_Field);
    }

    
    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() {
      if(this.selectedBoatId){
        return this.selectedBoatId ? TILE_WRAPPER_SELECTED_CLASS : TILE_WRAPPER_UNSELECTED_CLASS;
      }
    }
    
    // Fires event with the Id of the boat that has been selected.
    
    selectBoat(event) { 
      console.log('<><><>< In this'+this.boatid);
      this.selectedBoatId=this.boatid;
      console.log('<><><>< In this'+this.selectedBoatId);

      // creating boatselect event 
       const boatselectEvent = new CustomEvent('boatselect',{detail:{boatSelectedId:this.boatid}});
       this.dispatchEvent(boatselectEvent);
    }
  }