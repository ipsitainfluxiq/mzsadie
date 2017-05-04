/**
 * Created by ipsita on 2/5/17.
 */
import {Injectable} from '@angular/core';
import {Http,Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
@Injectable()

export class Adminlist{
    constructor(private http: Http) {}

    getUser() {
        return this.http.get(`http://influxiq.com:3001/adminlist`)
            .map((res:Response) => res.json().res); //get the adminlist array values to res.Response & call these to adminlist.component.ts
    }
    DeleteUser(id:any){
        //console.log(this.id);
        var link = 'http://influxiq.com:3001/deleteadmin';
        var data = {id: id};
       // console.log(data);
        return this.http.post(link, data)
            .map((res:Response) => '');
    }

}