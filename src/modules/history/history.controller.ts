import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('filter')
  findOne(@Query('region') region: string, @Query('type') type: string) {
    return this.historyService.filter(region, type);
  }

  @Delete(':id')
  deleteSms(@Param('id') id: string) {
    return this.historyService.deleteSms(+id);
  }
}
