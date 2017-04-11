import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { Index2Component } from './index2/index2.component';
import {appRoutingProviders, routing} from "./routes";
import { AboutComponent } from './about/about.component';
import { ExerciseComponent } from './exercise/exercise.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
//import {ContentComponent} from "./content/content.component";
import { PartyComponent } from './party/party.component';
import { FitLyfeComponent } from './fit-lyfe/fit-lyfe.component';
import { HomeBeautyRemediesComponent } from './home-beauty-remedies/home-beauty-remedies.component';
import { MillennialsComponent } from './millennials/millennials.component';
import { HeartHealthComponent } from './heart-health/heart-health.component';
import { FitnessComponent } from './fitness/fitness.component';
import { NutritionComponent } from './nutrition/nutrition.component';
import { BeautifulComponent } from './beautiful/beautiful.component';
import { HairhandsnailsfeetComponent } from './hairhandsnailsfeet/hairhandsnailsfeet.component';
import { NewmomsguideComponent } from './newmomsguide/newmomsguide.component';
import { BridalHomeComponent } from './bridal-home/bridal-home.component';
import { HeartCholesterolComponent } from './heart-cholesterol/heart-cholesterol.component';
import { BloodPressureComponent } from './blood-pressure/blood-pressure.component';
import { BridalMassageComponent } from './bridal-massage/bridal-massage.component';
import { BridalYogaComponent } from './bridal-yoga/bridal-yoga.component';
import { AdvanceAbsComponent } from './advance-abs/advance-abs.component';
import { StressManagementComponent } from './stress-management/stress-management.component';
import { PerfectPostureComponent } from './perfect-posture/perfect-posture.component';
import { ScentsRelaxationComponent } from './scents-relaxation/scents-relaxation.component';

@NgModule({
  declarations: [
    AppComponent,
    Index2Component,
    AboutComponent,
    ExerciseComponent,
    HeaderComponent,
    FooterComponent,
    PartyComponent,
    FitLyfeComponent,
    HomeBeautyRemediesComponent,
    MillennialsComponent,
    HeartHealthComponent,
    FitnessComponent,
    NutritionComponent,
    BeautifulComponent,
    HairhandsnailsfeetComponent,
    NewmomsguideComponent,
    BridalHomeComponent,
    HeartCholesterolComponent,
    BloodPressureComponent,
    BridalMassageComponent,
    BridalYogaComponent,
    AdvanceAbsComponent,
    StressManagementComponent,
    PerfectPostureComponent,
    ScentsRelaxationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
