'use strict';
import AllEvents from './all-events';
import FlushEventQueue from './flush-event-queue';
import ReportRawEvent from './report-raw-event';
import ReportSimpleEvent from './report-simple-event';
import SetEventTransformer from './set-event-transformer';
import SetIrtExtension from './set-irt-extension';
import StartAutoFlush from './start-auto-flush';
import StopAutoFlush from './stop-auto-flush';

export default () => {

  describe('Event Manager', () => {

    SetEventTransformer();
    SetIrtExtension();
    ReportSimpleEvent();
    ReportRawEvent();
    AllEvents();
    FlushEventQueue();
    StartAutoFlush();
    StopAutoFlush();

  }); //END Event Manager

}; //END export
