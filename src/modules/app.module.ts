import { Module } from "@nestjs/common";
import { HomeModule } from "./home/home.module";
import { CoreModule } from "./core/core.module";

@Module({
  imports: [
    CoreModule,
    HomeModule
  ]
})
export class AppModule {
}
