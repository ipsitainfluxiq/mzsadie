
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { ReactiveFormsModule } from '@angular/forms';
//import {DatePickerModule} from "ng2-datepicker/lib-dist/ng2-datepicker.module";
//import { CKEditorComponent } from '../../node_modules/cke';
// /import { CKEditorModule } from  '../../node_modules/ng2';
import { CKEditorModule } from 'ng2-ckeditor';
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
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminLeftsidebarComponent } from './admin-leftsidebar/admin-leftsidebar.component';
import { AdminTestformComponent } from './admin-testform/admin-testform.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminDashboard1Component } from './admin-dashboard1/admin-dashboard1.component';
import { AdminTableComponent } from './admin-table/admin-table.component';
import { AddadminComponent } from './addadmin/addadmin.component';
import { LoginComponent } from './login/login.component';
import { AdminlistComponent } from './adminlist/adminlist.component';
import { EditadminComponent } from './editadmin/editadmin.component';
import { UsersearchPipe } from './usersearch.pipe';
import { AdminprofileComponent } from './adminprofile/adminprofile.component';
import { UpdateprofileComponent } from './updateprofile/updateprofile.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { LogoutComponent } from './logout/logout.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { AccesscodeComponent } from './accesscode/accesscode.component';
import { NewpasswordComponent } from './newpassword/newpassword.component';
import { AddacesComponent } from './addaces/addaces.component';
import { AceslistComponent } from './aceslist/aceslist.component';
import { EditacesComponent } from './editaces/editaces.component';
//import { FilteredlistPipe } from './filteredlist.pipe';


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
    AdminHeaderComponent,
    AdminLeftsidebarComponent,
    AdminTestformComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AdminDashboard1Component,
    AdminTableComponent,
    AddadminComponent,
    LoginComponent,
    AdminlistComponent,
    EditadminComponent,
    UsersearchPipe,
    AdminprofileComponent,
    UpdateprofileComponent,
    ChangepasswordComponent,
    LogoutComponent,
    ForgetpasswordComponent,
    AccesscodeComponent,
    NewpasswordComponent,
    AddacesComponent,
    AceslistComponent,
    EditacesComponent,
   // FilteredlistPipe
  ],
  imports: [

    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    //DatePickerModule,
    HttpModule,
    CKEditorModule,
    routing
  ],
  providers: [appRoutingProviders,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
