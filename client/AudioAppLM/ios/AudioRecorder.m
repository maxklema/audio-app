#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(AudioRecorder, NSObject)
  RCT_EXTERN_METHOD(startRecording)
  RCT_EXTERN_METHOD(stopRecording)
  RCT_EXTERN_METHOD(playAudio)
  RCT_EXTERN_METHOD(toggleVolume:(float)playerVolume)
@end
