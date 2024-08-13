import Foundation
import AVFoundation
import React

@objc(AudioRecorder)
class AudioRecorder: NSObject, RCTBridgeModule {
  static func moduleName() -> String {
    return "AudioRecorder"
  }
  
  private var audioEngine: AVAudioEngine!
  private var inputNode: AVAudioInputNode!
  private var outputNode: AVAudioOutputNode!
  private var playerNode: AVAudioPlayerNode!
  private var sampleRate: Double = 48000.0 //44.1 kHz
  private var channels: UInt32 = 1
  
  @objc
  override init() {
    super.init()
    audioEngine = AVAudioEngine()
    inputNode = audioEngine.inputNode
    outputNode = audioEngine.outputNode
    playerNode = AVAudioPlayerNode()
  
    let format = AVAudioFormat(
      commonFormat: .pcmFormatFloat32,
      sampleRate: sampleRate,
      channels: channels,
      interleaved: false
    )
    
    audioEngine.attach(playerNode)
    
    //Allows you to receive audio data from the node for processing or inspection
    // The block gets executed everytime a new audio buffer is available
    inputNode.installTap(onBus: 0, bufferSize: 1024, format: format) { [weak self] (buffer, when) in
        self?.processAudioBuffer(buffer)
    }
    
  }
  
  @objc
  func start() {
    do {
      try audioEngine.start()
      
      playerNode.play()
    } catch {
      print("Error starting audio engine: \(error.localizedDescription)")
    }
  }
  
  @objc
  func stop() {
    audioEngine.stop()
  }
  
  private func processAudioBuffer(_ buffer: AVAudioPCMBuffer) {
    //process audio buffer or stream it
      
    let format = buffer.format
    
    audioEngine.connect(playerNode, to: audioEngine.mainMixerNode, format: format)
//    let channelData = buffer.floatChannelData //creates a pointer to an array of floats
//    let audioDataPointer = channelData?.pointee
//    let frameCount = Int(buffer.frameLength)
    
    playerNode.scheduleBuffer(buffer, at: nil, options: .loops, completionHandler: nil)
    
//    duration += Double(frameCount) / sampleRate
//    print("DURATION: ", duration)
//    
////    for i in 0..<min(frameCount, 100) {
////      print(audioDataPointer![i])
////    }
    
  }

  

}
