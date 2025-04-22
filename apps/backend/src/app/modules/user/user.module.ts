import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { User, UserSchema } from './user.schema';

// Services
import { SeederService } from '../../services/seeder.service';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      inject: [SeederService],
      name: User.name,
      useFactory: async (seederService: SeederService) => {
        await seederService.seedUsers();
        return UserSchema;
      }
    }]),
  ],
  providers: [
    UserService
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}
