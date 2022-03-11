import { IsOptional } from 'class-validator';
import { ToBoolean } from '../../utils/boolean-transformer';

export class FilterTodosDto {
  @IsOptional()
  @ToBoolean()
  isCompleted?: boolean;

  @IsOptional()
  search: string;
}
