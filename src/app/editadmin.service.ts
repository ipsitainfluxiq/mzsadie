/**
 * Created by ipsita on 3/5/17.
 */
import {Injectable} from '@angular/core';
import {Http,Response} from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()

export class Editadmin{
    constructor(private http: Http) {}
    editValue(dataForm:any,id:any) {
        var link= 'http://influxiq.com:3001/editadmin';
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
}