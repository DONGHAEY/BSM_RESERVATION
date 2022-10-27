import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {
    this.addNewTimeout('1', 10000, () => {
      console.log('ddddd');
    });
  }

  addNewTimeout(timeoutName: string, milliseconds: number, callBack) {
    const timeout = setTimeout(callBack, milliseconds);
    this.schedulerRegistry.addTimeout(timeoutName, timeout);
  }
}
