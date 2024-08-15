#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(AudioRecorder, RCTEventEmitter)
  RCT_EXTERN_METHOD(start)
  RCT_EXTERN_METHOD(stop)
  RCT_EXTERN_METHOD(playAudio:(NSArray<NSNumber *> *)rawData)
@end
