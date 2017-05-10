/**
 * Created by ipsita on 9/5/17.
 */
import {Injectable} from '@angular/core';
import {Http,Response} from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()

export class Employeelist{
    constructor(private http: Http) {}
    getDetails() {
        return this.http.get(`http://influxiq.com:3001/employeelist`)
            .map((res:Response) => res.json().res);
    }
    DeleteUser(id:any){
        var link = 'http://influxiq.com:3001/deleteemployee';
        var data = {id: id};

        return this.http.post(link, data)
            .map((res:Response) => '');
    }
}