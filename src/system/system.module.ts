import {Module} from '@nestjs/common';
import { PaginationService } from './helper/pagination.service';

@Module({
  controllers: [],
  providers: [PaginationService],
})
export class SystemModule {}
