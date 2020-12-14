import { LightningElement, track, wire,api } from 'lwc';
import { publish, MessageContext} from 'lightning/messageService';
import BoatMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';
export default class BoatSearchResults extends LightningElement { 
  data;
  error;
  @api selectedboattype='';
  columns = [];
  boatTypeId = '';
  isLoading = false;
  selectedBoatId='';
  @api boats;
  // wired message context
  @wire(MessageContext) messageContext;
  // wired getBoats method 
  @wire(getBoats,{ boatTypeId:'$selectedboattype'})
  boatslist({error,data}){
    if(data) {
      this.boats=data;
      console.log('data ==> '+JSON.stringify(data));
  }
  else if(error) {
      this.error = error;
      //console.log('data ==> '+JSON.stringify(error));
  }

  }
  
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  searchBoats(boatTypeId) { }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  refresh() { }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) { 
    console.log('<><><><><> event.detail in boatSearchResults12345'+event.detail.boatSelectedId);
    this.selectedBoatId=event.detail.boatSelectedId;
    sendMessageService(selectedBoatId);
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    console.log('<><><><><> boatId'+boatId);
    console.log('<><><><><> this.boatId'+this.boatId);
        const message = {
          recordId:boatId
        };
     // publish(this.messageContext, BoatMC, message);
  }
  
  // This method must save the changes in the Boat Editor
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave() {
  }
}