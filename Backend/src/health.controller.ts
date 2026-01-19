import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators';

@Controller()
export class HealthController {
  @Get()
  @Public()
  healthCheck() {
    return {
      status: 'ok',
      message: 'TE Management API is running',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @Public()
  health() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
