// apexContactsForAccount.js
import { LightningElement, wire, api } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import updateContacts from '@salesforce/apex/ContactController.updateContacts';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import Title_Field from '@salesforce/schema/contact.Title';
import Phone_Field from '@salesforce/schema/contact.Phone';
import Email_Field from '@salesforce/schema/contact.Email';
import ID_FIELD from '@salesforce/schema/Contact.Id';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';


const COLS = [
    { label: 'First Name', fieldName: 'FirstName', editable: true },
    { label: 'Last Name', fieldName: 'LastName', editable: true },
    { label: 'Title', fieldName: 'Title',editable:true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone',editable:true },
    { label: 'Email', fieldName: 'Email', type: 'email',editable:true }
];
export default class DatatableUpdateExample extends LightningElement {

    @api recordId;
    columns = COLS;
    draftValues = [];

    @wire(getContacts, { accId: '$recordId' })
    contact;

    //Update multiple record at onces 
    async handleSave(event) {
        const updatedFields = event.detail.draftValues;
        
        // Prepare the record IDs for getRecordNotifyChange()
        const notifyChangeIds = updatedFields.map(row => { return { "recordId": row.Id } });
    
       // Pass edited fields to the updateContacts Apex controller
        await updateContacts({data: updatedFields})
        .then(result => {
            console.log(JSON.stringify("Apex update result: "+ result));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );
    
        // Refresh LDS cache and wires
        getRecordNotifyChange(notifyChangeIds);
    
        // Display fresh data in the datatable
        return refreshApex(this.contact).then(() => {
            // Clear all draft values in the datatable
            this.draftValues = [];
          });
    
        
       }).catch(error => {
           this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or refreshing records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }



  // Update 1 record at a time 
  /*
    handleSave(event) {
     
        const fields = {}; For updating 1 record at a time 

        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        fields[FIRSTNAME_FIELD.fieldApiName] = event.detail.draftValues[0].FirstName;
        fields[LASTNAME_FIELD.fieldApiName] = event.detail.draftValues[0].LastName;
        fields[Title_Field.fieldApiName] = event.detail.draftValues[0].Title;
        fields[Phone_Field.fieldApiName] = event.detail.draftValues[0].Phone;
        fields[Email_Field.fieldApiName] = event.detail.draftValues[0].Email;
        
       
        // One record Update at one time remove async from the function name handleSave
        const recordInput = {fields};

        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );
            // Display fresh data in the datatable
            return refreshApex(this.contact).then(() => {

                // Clear all draft values in the datatable
                this.draftValues = [];

            });
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
        
    }
    */

}