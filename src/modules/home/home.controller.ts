import { Controller, Get } from "@nestjs/common";

@Controller('home')
export class HomeController {
  @Get()
  home(){
    return 'This action returns homepage';
  }
}
