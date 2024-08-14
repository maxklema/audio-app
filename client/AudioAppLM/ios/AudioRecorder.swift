import Foundation
import AVFoundation
import React
import Opus

@objc(AudioRecorder)
class AudioRecorder: NSObject, RCTBridgeModule {
  static func moduleName() -> String {
    return "AudioRecorder"
  }
  
  private var audioEngine: AVAudioEngine!
  private var inputNode: AVAudioInputNode!
  private var playerNode: AVAudioPlayerNode!
    
  private var sampleRate: Double! //kHz
  private var channels: UInt32 = 1
  
  @objc
  override init() {
    super.init()
    audioEngine = AVAudioEngine()
    inputNode = audioEngine.inputNode
    playerNode = AVAudioPlayerNode()
  
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
    audioEngine.stop()
  }

  private func processAudioBuffer(_ buffer: AVAudioPCMBuffer) {
  
    let bufferSize = Int(buffer.frameLength)
    
    let opusFormat = AVAudioFormat(
      commonFormat: .pcmFormatFloat32,
      sampleRate: sampleRate,
      channels: channels,
      interleaved: false
    )
    
    do {
      let encoder = try Opus.Encoder(format: opusFormat!)
      var bytes = [UInt8](repeating: 0, count: bufferSize)
      let output = try Int(encoder.encode(buffer, to: &bytes))
     
      bytes = Array(bytes.prefix(output))
      
      playAudio(rawData: bytes)
      
    } catch {
      print("Error encoding data: \(error.localizedDescription)")
    }
  }
  
  @objc
  func playAudio(rawData: [UInt8]) {
        
    // start the audio engine
    if !audioEngine.isRunning {
      start()
    }
    
    let opusFormat = AVAudioFormat(
      commonFormat: .pcmFormatFloat32,
      sampleRate: sampleRate,
      channels: channels,
      interleaved: false
    )
    
    do {
      
      //decode raw OPUS audio Data
      let decoder = try Opus.Decoder(format: opusFormat!)
      let buffer = try decoder.decode(Data(rawData))
      
      //play audio
      self.playerNode.play()
      self.playerNode.scheduleBuffer(buffer, at: nil, completionHandler: nil)
      
    } catch {
      print("Error Decoding Audio Data \(error.localizedDescription)")
    }
    
    
  }
}
