/**
 * Created by ipsita on 3/5/17.
 */
import {Injectable} from '@angular/core';
import {Http,Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
@Injectable()

export class Accesslist{
    constructor(private http: Http) {}
    getDetails() {
        return this.http.get(`http://influxiq.com:3001/aceslist`)
            .map((res:Response) => res.json().res); //get the adminlist array values to res.Response & call these to adminlist.component.ts
    }
    DeleteUser(id:any){
        //console.log(this.id);
        var link = 'http://influxiq.com:3001/deleteaces';
        var data = {id: id};
        // console.log(data);
        return this.http.post(link, data)
            .map((res:Response) => '');
    }
}