#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(AudioRecorder, NSObject)
  RCT_EXTERN_METHOD(start:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
  RCT_EXTERN_METHOD(stop)
  RCT_EXTERN_METHOD(play)
@end
