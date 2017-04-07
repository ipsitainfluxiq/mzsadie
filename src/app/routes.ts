/**
 * Created by ipsita on 7/4/17.
 */

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { AboutComponent }  from './about/about.component';
//import { ContactComponent }  from './contact/contact.component';
import { Index2Component }  from './index2/index2.component';
import { AboutComponent }  from './about/about.component';
import { ExerciseComponent } from './exercise/exercise.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {ContentComponent} from "./content/content.component";

const appRoutes: Routes = [
    // { path: '/**',component: AppComponent},
    //{ path: '/*',component: AppComponent},
    { path: '', component: Index2Component},
    { path: 'about', component: AboutComponent},
    { path: 'exercise', component: ExerciseComponent},
    { path: 'header', component: HeaderComponent,outlet:'header'},
    { path: 'footer', component: FooterComponent,outlet:'footer'},
    { path: 'content', component: ContentComponent,outlet:'content'},
];


export const appRoutingProviders: any[] = [
];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes,{ useHash: true });
