/**
 * Creating a class which only have one property seems a little bit overkilling,
 * we may argue that it's fine if directly using plain string. We can use a plain string,
 * but it's a good practice to use a DTO class, it got the following benefit.
 * 1. Uniformed contract, we exchanges/passin parameters via an object.
 * 2. In future if we need to add some extra property, we don't have to update contract
 *    We only need to update DTO class and where it's used, the contracts defintion won't need to update
 * 3. We can encapsulate validation inside the DTO when required
 */

import { IsNotEmpty } from 'class-validator';
export class AddTodoDto {
  @IsNotEmpty()
  public taskName: string;
}
