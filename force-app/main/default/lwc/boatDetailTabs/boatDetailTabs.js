import { LightningElement,api,wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';
import BoatMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import {subscribe,unsubscribe, APPLICATION_SCOPE,MessageContext} from 'lightning/messageService';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelDetails from '@salesforce/label/c.Details';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelReviews from '@salesforce/label/c.Reviews';
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
import { NavigationMixin } from 'lightning/navigation';


const BOAT_FIELDS = [BOAT_ID_FIELD,BOAT_NAME_FIELD];
export default class BoatDetailTabs extends LightningElement {

    label={labelPleaseSelectABoat,labelAddReview,labelDetails,labelFullDetails,labelReviews};
    subscription = null;
    @api boatId;
    wiredRecord;
    // Getter and Setter to allow for logic to run on recordId change
  // this getter must be public  
    get recordId() {
      return this.boatId;
    }
    set recordId(value) {
      this.setAttribute('boatId', value);
      this.boatId = value;
      console.log('<><><>set'+this.boatId);
    }

      // Initialize messageContext for Message Service
    @wire(MessageContext)
    messageContext;
    
    @wire(getRecord, {recordId: '$boatId', fields :BOAT_FIELDS})
    wiredRecord; 



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
      console.log('<><><> In handleMessage boatDetailsTab'+this.boatId);
    } 

    

    get boatName() {
      console.log("<><><><>< boatName"+JSON.stringify(this.wiredRecord.data));
        return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);

      }
     get detailsTabIconName(){
         if(this.wiredRecord.data){
             return 'utility:anchor';
         }
         return'';
     }

     navigateToRecordViewPage() {
      this[NavigationMixin.Navigate]({
          type: 'standard__recordPage',
          attributes: {
              recordId: this.boatId,
              objectApiName: 'Boat__c',
              actionName: 'view'
          }
      });
  }
}