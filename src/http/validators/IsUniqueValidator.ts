import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
  registerDecorator,
} from "class-validator";
import { AppDataSource } from "../../database/data-source";

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  public defaultMessage(): string {
    return `$property is already in use`;
  }

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [entity, field] = args.constraints;

    const repository = AppDataSource.getRepository(entity);

    const count = await repository.count({ where: { [field]: value } });

    return count <= 0;
  }
}

export function IsUnique(
  entity: any,
  field: string,
  validationOptions?: ValidatorOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, field],
      validator: IsUniqueConstraint,
    });
  };
}
