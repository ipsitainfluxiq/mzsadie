/**
 * Created by ipsita on 7/4/17.
 */

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Index2Component }  from './index2/index2.component';
import { AboutComponent }  from './about/about.component';
import { ExerciseComponent } from './exercise/exercise.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
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
import {AdminHeaderComponent} from "./admin-header/admin-header.component";
import {AdminLeftsidebarComponent} from "./admin-leftsidebar/admin-leftsidebar.component";
import {AdminTestformComponent} from "./admin-testform/admin-testform.component";
import {AdminLoginComponent} from "./admin-login/admin-login.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {AdminDashboard1Component} from "./admin-dashboard1/admin-dashboard1.component";
import {AdminTableComponent} from "./admin-table/admin-table.component";
import {AddadminComponent} from "./addadmin/addadmin.component";
import {LoginComponent} from "./login/login.component";
import {AdminlistComponent} from "./adminlist/adminlist.component";
import {EditadminComponent} from "./editadmin/editadmin.component";
import {UsersearchPipe} from "./usersearch.pipe";
import {AdminprofileComponent} from "./adminprofile/adminprofile.component";
import {UpdateprofileComponent} from "./updateprofile/updateprofile.component";
import {ChangepasswordComponent} from "./changepassword/changepassword.component";
import {LogoutComponent} from "./logout/logout.component";
import {ForgetpasswordComponent} from "./forgetpassword/forgetpassword.component";
import {AccesscodeComponent} from "./accesscode/accesscode.component";
import {NewpasswordComponent} from "./newpassword/newpassword.component";
import {AddacesComponent} from "./addaces/addaces.component";
import {AceslistComponent} from "./aceslist/aceslist.component";
import {EditacesComponent} from "./editaces/editaces.component";
import {CropimageComponent} from "./cropimage/cropimage.component";
import {EmailverifyComponent} from "./emailverify/emailverify.component";
import {ResetpasswordComponent} from "./resetpassword/resetpassword.component";
import {HighlightComponent} from "./highlight/highlight.component";
import {UrlcallComponent} from "./urlcall/urlcall.component";
import {AddemployeeComponent} from "./addemployee/addemployee.component";
import {EmployeelistComponent} from "./employeelist/employeelist.component";
import {EditemployeeComponent} from "./editemployee/editemployee.component";
import {EmployeedashboardComponent} from "./employeedashboard/employeedashboard.component";
import {ViewhistoryComponent} from "./viewhistory/viewhistory.component";
import {AddreviewComponent} from "./addreview/addreview.component";
import {ViewreviewComponent} from "./viewreview/viewreview.component";
import {ViewreviewofemployeeComponent} from "./viewreviewofemployee/viewreviewofemployee.component";
import {ViewlogindetailsComponent} from "./viewlogindetails/viewlogindetails.component";
import {ReplyComponent} from "./reply/reply.component";
import {ViewlogoutdetailsComponent} from "./viewlogoutdetails/viewlogoutdetails.component";
import {ViewlogouthistoryComponent} from "./viewlogouthistory/viewlogouthistory.component";
import {EmployeeloginouttimeComponent} from "./employeeloginouttime/employeeloginouttime.component";
import {CardioComponent} from "./cardio/cardio.component";
import {GeneraldoctorComponent} from "./generaldoctor/generaldoctor.component";

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
    { path: 'admin_header', component: AdminHeaderComponent,outlet:'header'},
    { path: 'admin_leftsidebar', component: AdminLeftsidebarComponent,outlet:'leftsidebar'},
    { path: 'admin_testform', component: AdminTestformComponent},
    { path: 'admin_login', component: AdminLoginComponent},
    { path: 'admin_dashboard', component: AdminDashboardComponent},
    { path: 'admin_dashboard1', component: AdminDashboard1Component},
    { path: 'admin_table', component: AdminTableComponent},
    { path: 'addadmin', component: AddadminComponent},
    { path: 'login', component: LoginComponent},
    { path: 'adminlist', component: AdminlistComponent},
    { path: 'editadmin/:id', component: EditadminComponent},
    { path: 'usersearch', component: UsersearchPipe},
    { path: 'adminprofile', component: AdminprofileComponent},
    { path: 'updateprofile', component: UpdateprofileComponent},
    { path: 'changepassword', component: ChangepasswordComponent},
    { path: 'logout', component: LogoutComponent},
    { path: 'forgetpassword', component: ForgetpasswordComponent},
    { path: 'accesscode', component: AccesscodeComponent},
    { path: 'newpassword', component: NewpasswordComponent},
    { path: 'addaces', component: AddacesComponent},
    { path: 'aceslist', component: AceslistComponent},
    { path: 'editaces/:id', component: EditacesComponent},
    { path: 'cropimage', component: CropimageComponent},
    { path: 'emailverify/:id', component: EmailverifyComponent},
    { path: 'resetpassword/:id', component: ResetpasswordComponent},
    { path: 'highlight', component: HighlightComponent},
    { path: 'urlcall', component: UrlcallComponent},
    { path: 'addemployee', component: AddemployeeComponent},
    { path: 'employeelist', component: EmployeelistComponent},
    { path: 'editemployee/:id', component: EditemployeeComponent},
    { path: 'employeedashboard', component: EmployeedashboardComponent},
    { path: 'viewhistory/:id', component: ViewhistoryComponent},
    { path: 'addreview/:id', component: AddreviewComponent},
    { path: 'viewreview', component: ViewreviewComponent},
    { path: 'viewreviewofemployee/:id', component: ViewreviewofemployeeComponent},
    { path: 'viewlogindetails', component: ViewlogindetailsComponent},
    { path: 'reply/:id/:employeeid', component: ReplyComponent},
    { path: 'viewlogoutdetails/:id', component: ViewlogoutdetailsComponent},
    { path: 'viewlogouthistory', component: ViewlogouthistoryComponent},
    { path: 'employeeloginouttime', component: EmployeeloginouttimeComponent},
    { path: 'cardio', component: CardioComponent},
    { path: 'generaldoctor', component: GeneraldoctorComponent},

   // { path: 'content', component: ContentComponent,outlet:'content'},
];


export const appRoutingProviders: any[] = [
];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes,{ useHash: true });
