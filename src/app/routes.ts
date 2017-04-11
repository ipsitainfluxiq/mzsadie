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
//import {ContentComponent} from "./content/content.component";
import {PartyComponent} from "./party/party.component";
import {FitLyfeComponent} from "./fit-lyfe/fit-lyfe.component";
import {HomeBeautyRemediesComponent} from "./home-beauty-remedies/home-beauty-remedies.component";
import {MillennialsComponent} from "./millennials/millennials.component";
import {HeartHealthComponent} from "./heart-health/heart-health.component";
import {FitnessComponent} from "./fitness/fitness.component";
import {NutritionComponent} from "./nutrition/nutrition.component";
import {BeautifulComponent} from "./beautiful/beautiful.component";
import {HairhandsnailsfeetComponent} from "./hairhandsnailsfeet/hairhandsnailsfeet.component";
import {NewmomsguideComponent} from "./newmomsguide/newmomsguide.component";
import {BridalHomeComponent} from "./bridal-home/bridal-home.component";
import {HeartCholesterolComponent} from "./heart-cholesterol/heart-cholesterol.component";
import {BloodPressureComponent} from "./blood-pressure/blood-pressure.component";
import {BridalMassageComponent} from "./bridal-massage/bridal-massage.component";
import {BridalYogaComponent} from "./bridal-yoga/bridal-yoga.component";
import {AdvanceAbsComponent} from "./advance-abs/advance-abs.component";
import {StressManagementComponent} from "./stress-management/stress-management.component";
import {PerfectPostureComponent} from "./perfect-posture/perfect-posture.component";
import {ScentsRelaxationComponent} from "./scents-relaxation/scents-relaxation.component";
//import {HeartHealthComponent} from "./heart-health/heart-health.component";

const appRoutes: Routes = [
    // { path: '/**',component: AppComponent},
    //{ path: '/*',component: AppComponent},
    { path: '', component: Index2Component},
    { path: 'about', component: AboutComponent},
    { path: 'party', component: PartyComponent},
    { path: 'fitlyfe',component:FitLyfeComponent},
    { path: 'homebeautyremedies',component:HomeBeautyRemediesComponent},
    { path: 'millennials',component:MillennialsComponent},
    { path: 'hearthealth',component:HeartHealthComponent},
    { path: 'fitness',component:FitnessComponent},
    { path: 'exercise', component: ExerciseComponent},
    { path: 'nutrition', component: NutritionComponent},
    { path: 'beautiful', component: BeautifulComponent},
    { path: 'hairhandsnailsfeet', component: HairhandsnailsfeetComponent},
    { path: 'newmomsguide', component: NewmomsguideComponent},
    { path: 'bridalhome', component: BridalHomeComponent},
    { path: 'heartcholesterol', component: HeartCholesterolComponent},
    { path: 'bloodpressure', component: BloodPressureComponent},
    { path: 'bridalmassage', component: BridalMassageComponent},
    { path: 'bridalyoga', component: BridalYogaComponent},
    { path: 'advanceabs', component: AdvanceAbsComponent},
    { path: 'stressmanagement', component: StressManagementComponent},
    { path: 'perfectposture', component: PerfectPostureComponent},
    { path: 'scentsrelaxation', component: ScentsRelaxationComponent},
    { path: 'header', component: HeaderComponent,outlet:'header'},
    { path: 'footer', component: FooterComponent,outlet:'footer'},
   // { path: 'content', component: ContentComponent,outlet:'content'},
];


export const appRoutingProviders: any[] = [
];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes,{ useHash: true });
