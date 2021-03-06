import { CookieService } from 'angular2-cookie/services/cookies.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2UploaderModule } from 'ng2-uploader';
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
import { CropimageComponent } from './cropimage/cropimage.component';
import { UsersearchPipe } from './usersearch.pipe';
import { OrderBy } from './orderby';
import { Adminlist } from './adminlist';
import { ExampleService } from './example.service';
import { Accesslist } from './aceslist.service';
import { Editadmin } from './editadmin.service';
import { Addadmin } from './addadmin.service';
import { Commonservices } from './app.commonservices';
import { EmailverifyComponent } from './emailverify/emailverify.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { HighlightComponent } from './highlight/highlight.component';
import { UrlcallComponent } from './urlcall/urlcall.component';
import { AddemployeeComponent } from './addemployee/addemployee.component';
import { EmployeelistComponent } from './employeelist/employeelist.component';
import { EditemployeeComponent } from './editemployee/editemployee.component';

import { EmployeedashboardComponent } from './employeedashboard/employeedashboard.component';
import { ViewhistoryComponent } from './viewhistory/viewhistory.component';
import { AddreviewComponent } from './addreview/addreview.component';
import { ViewreviewComponent } from './viewreview/viewreview.component';
import { ViewreviewofemployeeComponent } from './viewreviewofemployee/viewreviewofemployee.component';
import { ViewlogindetailsComponent } from './viewlogindetails/viewlogindetails.component';
import { ReplyComponent } from './reply/reply.component';
import { ViewlogoutdetailsComponent } from './viewlogoutdetails/viewlogoutdetails.component';
import { ViewlogouthistoryComponent } from './viewlogouthistory/viewlogouthistory.component';
import { EmployeeloginouttimeComponent } from './employeeloginouttime/employeeloginouttime.component';
import { CardioComponent } from './cardio/cardio.component';
import { GeneraldoctorComponent } from './generaldoctor/generaldoctor.component';

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
    CropimageComponent,
   // FilteredlistPipe
    OrderBy,
   EmailverifyComponent,
   ResetpasswordComponent,
   HighlightComponent,
   UrlcallComponent,
   AddemployeeComponent,
   EmployeelistComponent,
   EditemployeeComponent,

   EmployeedashboardComponent,

   ViewhistoryComponent,

   AddreviewComponent,

   ViewreviewComponent,

   ViewreviewofemployeeComponent,

   ViewlogindetailsComponent,

   ReplyComponent,

   ViewlogoutdetailsComponent,

   ViewlogouthistoryComponent,

   EmployeeloginouttimeComponent,

   CardioComponent,

   GeneraldoctorComponent,
    //ExampleService,

  ],
  imports: [

      BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    //DatePickerModule,
    HttpModule,
    CKEditorModule,
    Ng2UploaderModule,
    routing
  ],
  providers: [appRoutingProviders,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }