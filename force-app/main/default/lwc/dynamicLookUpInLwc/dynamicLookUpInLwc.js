import { LightningElement,api,wire } from 'lwc';
import searchRecords from '@salesforce/apex/DynamicLookUp.searchRecords';
/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 600;
export default class DynamicLookUpInLwc extends LightningElement {
    // tracking attribute values
    @api ObjectName;
    @api ObjectFields; 
    @api searchKey='';
    @wire(searchRecords,{searchKey:'$searchKey',objectAPIName:'$ObjectName'})
    searchData;

    handleKeyUp(event){
        console.log('<><>'+this.ObjectName);
        if(this.ObjectName){
            // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
        }
    }   
    handleClick(event){
        console.log('<><>< in DynamicLookUpInLwc123');
       // console.log('<><>< in DynamicLookUpInLwc'+event.detail.sobjectid);
        //console.log('<><>< in DynamicLookUpInLwc'+event.detail.sobjectname);
        this.searchKey = '';
       this.template.querySelector("lightning-input").value=event.detail.sobjectname;       
    }
 }