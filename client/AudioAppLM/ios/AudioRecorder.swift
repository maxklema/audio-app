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
  private var sampleRate: Double! //kHz
  private var channels: UInt32 = 1
  
  @objc
  override init() {
    super.init()
    audioEngine = AVAudioEngine()
    inputNode = audioEngine.inputNode
    outputNode = audioEngine.outputNode
    playerNode = AVAudioPlayerNode()
  
    //configure AVAudioSession for playback
    let audioSession = AVAudioSession.sharedInstance()
    do {
      try audioSession.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .allowBluetooth, .mixWithOthers])
      try audioSession.setActive(true)
      
      sampleRate = audioSession.sampleRate
      
    } catch {
      print("Failed to set up AVAudioSession: \(error.localizedDescription)")
    }
    
    let format = AVAudioFormat(
      commonFormat: .pcmFormatFloat32,
      sampleRate: sampleRate,
      channels: channels,
      interleaved: false
    )
    
    audioEngine.attach(playerNode)
    audioEngine.connect(playerNode, to: audioEngine.mainMixerNode, format: format)
    
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
    } catch {
      print("Error starting audio engine: \(error.localizedDescription)")
    }
  }
  
  @objc
  func stop() {
    playerNode.stop()
//    audioEngine.stop()
  }
  
  private func processAudioBuffer(_ buffer: AVAudioPCMBuffer) {
  
    let delay: TimeInterval = 3.0 // Wait for 5 seconds
    
    playerNode.scheduleBuffer(buffer, at: nil, completionHandler: nil)
    
    // Start playback
    // Delay playback
    DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
        if !self.playerNode.isPlaying {
            print("is playing!")
            self.playerNode.play()
        }
    }
    
  }

  

}
