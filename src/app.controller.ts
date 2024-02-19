import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('sam-test')
  samTest() {
    return this.appService.samTest1();
  }

  @Get('sam-test2')
  samTest2() {
    return this.appService.samTest2();
  }

  @Get('sam-test3')
  samTest3() {
    return this.appService.samTest3();
  }
}
