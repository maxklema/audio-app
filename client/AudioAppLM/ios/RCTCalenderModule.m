//RCTCalenderModule.m

#import "RTCCalenderModule.h"
#import <React/RCTLog.h>

@implementation  RCTCalenderModule

// To export a module named RCTCalenderModule

RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
 RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getName)
{
  return [ [UIDevice currentDevice] name];
}

@end
