/**
 * Created by ipsita on 2/5/17.
 */
import {Injectable} from '@angular/core';
import {Http,Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
@Injectable()

export class ExampleService{
    constructor(private http: Http)
    {
    }
/*    Greetings(){
        var a=5;
        return a;
    }*/
    getUser() {
        return this.http.get(`http://influxiq.com:3001/testlist`)
            .map((res:Response) => res.json());
    }

}