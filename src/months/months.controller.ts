import { Controller, Param, Post } from '@nestjs/common';
import { MonthsService } from './months.service';

@Controller('months')
export class MonthsController {
  constructor(private readonly monthsService: MonthsService) {}
  @Post('/generate/:month')
  generateMonth(@Param('month') month: Date) {
    return this.monthsService.generateMonth(month);
  }
}
