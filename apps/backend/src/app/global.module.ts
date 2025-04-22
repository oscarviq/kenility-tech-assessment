import { Module, Global } from '@nestjs/common';

// Services
import { SeederService } from './services/seeder.service';

@Global()
@Module({
  controllers: [],
  providers: [
    SeederService
  ],
  exports: [
    SeederService
  ]
})
export class GlobalModule {}
