/**
 * Created by ipsita on 3/5/17.
 */
import {Injectable} from '@angular/core';
import {Http,Response} from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()

export class Addadmin{
    constructor(private http: Http) {}

    postUser(dataForm:any) {
       // console.log(dataForm.value);
        var link = 'http://influxiq.com:3001/addadmin';
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
}