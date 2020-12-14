import { LightningElement } from 'lwc';

export default class LightningExampleMapSingleMarker extends LightningElement {
    mapMarkers = [
        {
            location: {
                Latitude: '37.790197',
                Longitude: '-122.396879'
            },

            title: 'The White House',
            description:
                'Landmark, historic home & office of the United States president, with tours for visitors.',
        },
    ];
}