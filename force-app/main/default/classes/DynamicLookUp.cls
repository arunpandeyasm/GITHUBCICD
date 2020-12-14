public with sharing class DynamicLookUp {
   
    //Wrapper class to define to store the data 
    public class Lookup {
        @AuraEnabled
        public String Id;
        @AuraEnabled
        public String Name;
        public Lookup(String Id, String Name) {
            this.Id = Id;
            this.Name = Name;
        }
    } 
    @AuraEnabled(cacheable=true)
    public static List<Lookup> searchRecords(String searchKey, String objectAPIName) {
        system.debug('<><>'+searchKey);
        system.debug('<><>'+objectAPIName);
        String query = 'FIND \'*' + searchKey + '*\' IN NAME FIELDS RETURNING ';
        for(String objectName:objectAPIName.split(',')){
            query = query+' '+objectName+'(Id,Name)'+',';
        }
        query = query.removeEnd(',');
        system.debug('<><>'+query);
        List<List<sObject>> searchResults = search.query(query);
        system.debug('<><>'+objectAPIName);
        List<Lookup> results = new List<Lookup>();
 
        for(List<SObject> sObjList: searchResults)  {
            for (SObject sObj : sObjList) {
                results.add(new Lookup((String) sObj.get('Id'), (String) sObj.get('Name')));
            }
        }
        system.debug('<><>'+results);
        return results;
    }

}