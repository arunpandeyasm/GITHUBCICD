// apexContactsForAccount.js
import { LightningElement, wire, api } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Boat__c.Description__c';



const COLS = [
    { label: 'Name', fieldName: 'Name', editable: true ,type:'text',sortable: "true"},
    { label: 'Length', fieldName: 'Length__c', editable: true ,type:'number',sortable: "true"},
    { label: 'Price', fieldName: 'Price__c',editable: true,type:'currency',sortable: "true"},
    { label: 'Description', fieldName: 'Description__c',editable: true , type: 'text',sortable: "true"},
];
export default class DatatableUpdateExample extends LightningElement {

    recordId='';
    columns = COLS;
    draftValues = [];
    sortBy;
    sortDirection;
    data;
    

    @wire(getBoats, { boatTypeId: '$recordId' })
    boat(result){
        if (result.data) {
            this.data = result.data;
            this.error = undefined;

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }

    handleSave(event) {
        const MESSAGE_SHIP_IT='Ship It!';
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(boats => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message:'Ship It!',
                    variant: 'success'
                })
            );
             // Clear all draft values
             this.draftValues = [];
    
             // Display fresh data in the datatable
             return refreshApex(this.boat);
        }).catch(error => {
            new ShowToastEvent({
                title: 'Error updating or refreshing records',
                message: error.body.message,
                variant: 'error'
            })
        });
    }
    handleSortdata(event) {
        // field name
        this.sortBy = event.detail.fieldName;

        // sort direction
        this.sortDirection = event.detail.sortDirection;

        // calling sortdata function to sort the data based on direction and selected field
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }

    sortData(fieldname, direction) {
        // serialize the data before calling sort function
        let parseData = JSON.parse(JSON.stringify(this.data));

        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };

        // cheking reverse direction 
        let isReverse = direction === 'asc' ? 1: -1;

        // sorting data 
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';

            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });

        // set the sorted data to data table data
        this.data = parseData;
    }
    
}