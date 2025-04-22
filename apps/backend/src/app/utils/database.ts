import { Logger } from '@nestjs/common';
import { Connection } from 'mongoose';

const logger: Logger = new Logger('MongoDB');

export default {
  onConnectionCreate: (connection: Connection) => {
    logger.log('Connected');
    connection.on('error', (err) => logger.error('Connection error', err));
    connection.on('disconnected', () => logger.warn('Disconnected'));
    connection.on('reconnected', () => logger.log('Reconnected'));
  }
}
