/**
 * Created by ipsita on 10/5/17.
 */
import {Injectable} from '@angular/core';
import {Http,Response} from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class Commonservices{
    items:Array<any>;
    url:any
    constructor(private http: Http) {
        if(window.location.hostname=='localhost'){
            this.url= 'http://influxiq.com:3001/';
        }
        else{
            this.url= 'http://influxiq.com:3001/';
        }
        this.items = [
            { serverUrl: this.url },
            { name: 'Ipsita' }
        ];
    }


    /*---------------------------------------------------START_URL-----------------------------------------------*/
    getItems() {
        return this.items;
    }


    /*---------------------------------------------------END_URL-----------------------------------------------*/
    /*---------------------------------------------------START_EmployeeList-----------------------------------------------*/
    getDetailsEmployee() {

        //var link1 =this.url+'employeelist';
        return this.http.get(this.url+'employeelist')
            .map((res:Response) => res.json().res);
    }
    DeleteEmployee(id:any){
        //var link = 'http://influxiq.com:3001/deleteemployee';
        var link= this.url+'deleteemployee';
        var data = {id: id};

        return this.http.post(link, data)
            .map((res:Response) => '');
    }
    /*---------------------------------------------------END_EmployeeList---------------------------------------------------*/
    /*---------------------------------------------------START_Editadmin-----------------------------------------------*/
    editValue(dataForm:any,id:any) {
        //var link= 'http://influxiq.com:3001/editadmin';
        var link= this.url+'editadmin';
        //console.log(dataForm.value);
//console.log(id);
        var data = {
            id: id,
            firstname: dataForm.value.firstname,
            lastname:  dataForm.value.lastname,
            email:  dataForm.value.email,
            password:  dataForm.value.password,
            phone:  dataForm.value.phone,
            address:  dataForm.value.address,
            city:  dataForm.value.city,
            state:  dataForm.value.state,
            zip:  dataForm.value.zip
        };
        return this.http.post(link, data)
            .map((res:Response) => res.json());
    }
    /*---------------------------------------------------END_Editadmin-----------------------------------------------*/
    /*---------------------------------------------------START_Aceslist-----------------------------------------------*/
    getDetailsAces() {
        //return this.http.get(`http://influxiq.com:3001/aceslist`)
        return this.http.get(this.url+'aceslist')
            .map((res:Response) => res.json().res); //get the adminlist array values to res.Response & call these to adminlist.component.ts
    }
    DeleteAces(id:any){
        //console.log(this.id);
       // var link = 'http://influxiq.com:3001/deleteaces';
        var link= this.url+'deleteaces';
        var data = {id: id};
        // console.log(data);
        return this.http.post(link, data)
            .map((res:Response) => '');
    }
    /*---------------------------------------------------END_Aceslist-----------------------------------------------*/
    /*---------------------------------------------------START_Adminlist-----------------------------------------------*/
    getAdmin() {
        //return this.http.get(`http://influxiq.com:3001/adminlist`)
        return this.http.get(this.url+'adminlist')
            .map((res:Response) => res.json().res); //get the adminlist array values to res.Response & call these to adminlist.component.ts
    }
    DeleteAdminlist(id:any){
        //console.log(this.id);
        var link= this.url+'deleteadmin';
        //var link = 'http://influxiq.com:3001/deleteadmin';
        var data = {id: id};
        // console.log(data);
        return this.http.post(link, data)
            .map((res:Response) => '');
    }

    /*---------------------------------------------------END_Adminlist-----------------------------------------------*/
    /*---------------------------------------------------START_Addadmin-----------------------------------------------*/
    postUser(dataForm:any) {
        // console.log(dataForm.value);
        //var link = 'http://influxiq.com:3001/addadmin';
        var link= this.url+'addadmin';
        /*var data = {id: id};*/
        var data = {
            //dataForm:dataForm,
            firstname: dataForm.value.firstname,
            lastname:  dataForm.value.lastname,
            email:  dataForm.value.email,
            password:  dataForm.value.password,
            phone:  dataForm.value.phone,
            address:  dataForm.value.address,
            city:  dataForm.value.city,
            state:  dataForm.value.state,
            zip:  dataForm.value.zip
        };
        console.log("addadminservice");
        //console.log(data);
        return this.http.post(link, data)
            .map((res:Response) => res.json());
    }
    /*---------------------------------------------------END_Addadmin-----------------------------------------------*/
    /*---------------------------------------------------START_TIME-----------------------------------------------*/

    convertunixtodate(unix_tm:any) {
        var tmnew= unix_tm*1000;
        var dt = new Date(tmnew);
        var month = dt.getMonth()+1;
        return  month+'/'+dt.getDate()+'/'+dt.getFullYear() ;

    }
    convertunixtotime(unix_tm:any){
        var tmnew= unix_tm*1000;
        var dt = new Date(tmnew);
        var month = dt.getMonth()+1;
        var hours = dt.getHours();
        var minutes = dt.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? 0+ minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;

      //  return  dt.getHours()+' : '+dt.getMinutes()+' : '+dt.getSeconds() ;
    }
    convertunixtodatetime(unix_tm:any) {
        var tmnew= unix_tm*1000;
        var dt = new Date(tmnew);
      /*  var dt = new Date(unix_tm);*/
        var month = dt.getMonth()+1;
        return  month+'/'+dt.getDate()+'/'+dt.getFullYear()+' '+dt.getHours()+' : '+dt.getMinutes()+' : '+dt.getSeconds() ;

    }
    currenttime() {
        var dt = new Date();
        var hours = dt.getHours();
        var minutes = dt.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? 0+ minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
        /*/!*  var dt = new Date();
         // var month = dt.getMonth()+1;
         return  dt.getHours()+' : '+dt.getMinutes();*!/*/

    }
    /*---------------------------------------------------END_TIME-----------------------------------------------*/



}