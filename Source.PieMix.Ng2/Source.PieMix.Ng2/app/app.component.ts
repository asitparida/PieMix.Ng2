import {Component} from 'angular2/core';
import {PieMixComponent} from './piemix.component';
@Component({
    selector: 'my-app',
    template: '<pie-mix></pie-mix>',
    directives: [PieMixComponent]
})
export class AppComponent {
    title = 'Tour of Heroes';
    
}