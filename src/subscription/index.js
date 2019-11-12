import { PubSub } from 'apollo-server';

import * as EMPLOYEE_EVENTS from './employee';

export const EVENTS = {
  EMPLOYEE: EMPLOYEE_EVENTS,
};

export default new PubSub();
