import { Farm } from '../models';
import { FarmService } from './farm';

export const farmService = new FarmService(Farm);
