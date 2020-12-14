import { LightningElement,api} from 'lwc';
export default class GenericLookupClick extends LightningElement {
@api returnrecords;
selectedRecord(event){
   console.log('<><><><> In Out In');
   console.log('<><><><>'+this.returnrecords.Id);
   //var sobjectidname={sobjectid:this.returnrecords.Id,sobjectname:this.returnrecords.Name};
   const getidEvent = new CustomEvent('getid',{detail:{sobjectid:this.returnrecords.Id,sobjectname:this.returnrecords.Name}})
   this.dispatchEvent(getidEvent); 
}

}