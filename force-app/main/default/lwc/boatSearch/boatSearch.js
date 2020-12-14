import { LightningElement,api} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;
    @api selectedboattype='';
    
    // Handles loading event
    handleLoading() { }
    
    // Handles done loading event
    handleDoneLoading() { }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) { 
        console.log('---- in boatSearch'+event.detail.boatTypeId); 
        this.selectedboattype = event.detail.boatTypeId;
        console.log('---- +'+ this.selectedboattype.boatTypeId); 
    }
    
    createNewBoat() { 
        console.log('----');
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new'
            }
        });
    }
  }