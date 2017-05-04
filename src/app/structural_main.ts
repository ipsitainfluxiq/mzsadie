/**
 * Created by ipsita on 4/5/17.
 */


/*import {bootstrap} from 'angular2/platform/browser';
import {HighlightComponent} from './highlight/highlight.component';
bootstrap(HighlightComponent);*/


import {HighlightComponent} from './highlight/highlight.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
platformBrowserDynamic().bootstrapModule(HighlightComponent);