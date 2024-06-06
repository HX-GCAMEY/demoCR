import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  //? definimos nombre de validación y no es async
  @ValidatorConstraint({
    name: 'MatchPassword',
    async: false,
  })
  export class MatchPassword implements ValidatorConstraintInterface {
	  //? Compara password con password de confirmación
    validate(password: string, args: ValidationArguments) {
      if (password !== (args.object as any)[args.constraints[0]]) return false;

      return true;
    }
    
    //? si validación falla...
    defaultMessage(args?: ValidationArguments): string {
      return 'Password and password confirmation do not match';
    }
  }