import { LightningElement, track, wire,api } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';
let i=0;
export default class BoatSearchForm extends LightningElement {
        @api selectedBoatTypeId = '';
        @track items = []; //this will hold key, value pair
              
        // Private
        error = undefined;
       
        
        // Needs explicit track due to nested data
        
        // Needs explicit track due to nested data
        @track searchOptions;

        
          @wire(getBoatTypes)
          boatTypes({ error, data }) {
            
          if (data) { 
            this.searchOptions = data.map(type => {
              return {
                label: type.Name,
                value: type.Id
                };
            });
            this.searchOptions.unshift({ label: 'All Types', value: '' });                      
          } else if (error) {
          this.searchOptions = undefined;
          this.error = error;
          }
          }
      // Fires event that the search option has changed.
      // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
      handleSearchOptionChange(event) {
        //alert("Hi");
        console.log("<><><>< in handleSearchOptionChange"+event.detail.value);
        // Create the const searchEvent
        // searchEvent must be the new custom event search
        this.selectedBoatTypeId = event.detail.value;
        console.log("<><><>< value"+this.selectedBoatTypeId);
        const searchEvent = new CustomEvent('search',{detail:{boatTypeId : this.selectedBoatTypeId}}); 
        this.dispatchEvent(searchEvent);
     }      
    }