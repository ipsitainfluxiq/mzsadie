import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usersearch'
})
export class UsersearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(args);
    console.log(value);

    //return null;
    args = args.toLocaleLowerCase();

    if(args == ''){
      return value;
    }else {
      return value.filter(value=> (value.firstname.toLocaleLowerCase().indexOf(args) != -1 || value.lastname.toLocaleLowerCase().indexOf(args) != -1 || value.email.toLocaleLowerCase().indexOf(args) != -1)  );
    }




  }

}
