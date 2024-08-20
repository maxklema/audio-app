import Foundation
import AVFoundation
import React
import Opus

@objc(AudioRecorder)
class AudioRecorder: RCTEventEmitter {
  
  private var audioEngine: AVAudioEngine!
  private var inputNode: AVAudioInputNode!
  private var playerNode: AVAudioPlayerNode!
    
  private var sampleRate: Double! //kHz
  private var channels: UInt32 = 1
  private var muted: Bool = false
  
  override static func moduleName() -> String {
    return "AudioRecorder"
  }
  
  override func supportedEvents() -> [String]! {
    return ["opusAudio"]
  }
  
  
  private func initialize() {
    if (audioEngine == nil) {
      audioEngine = AVAudioEngine()
    }
    
    if inputNode == nil {
      inputNode = audioEngine.inputNode
    }
    
    if playerNode == nil {
      playerNode = AVAudioPlayerNode()
    }
//    audioEngine = AVAudioEngine()
//    inputNode = audioEngine.inputNode
//    playerNode = AVAudioPlayerNode()
    
    
    let audioSession = AVAudioSession.sharedInstance()
    do {
<<<<<<< HEAD
      try audioSession.setCategory(.playAndRecord, mode: .voiceChat, options: [.defaultToSpeaker, .allowBluetooth])
=======
      try audioSession.setCategory(.playAndRecord, mode: .videoChat, options: [.defaultToSpeaker, .allowBluetooth])
>>>>>>> 3b7355e (client changes and such)
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
    
    toggleMute(!muted)
    
    if inputNode.inputFormat(forBus: 0).channelCount > 0 {
        audioEngine.inputNode.removeTap(onBus: 0)
    }
          
    var data : [UInt8]!
    
    // The block gets executed everytime a new audio buffer is available
    inputNode.installTap(onBus: 0, bufferSize: 1024, format: format) { [weak self] (buffer, when) in
      do {
        if (!self!.muted){
          data = try self?.processAudioBuffer(buffer)
          self?.sendBufferToReactNative(opusAudio: data)
        }
      } catch {
        print("Error recieving audio data")
      }
    }
  }
  
  @objc
  func start() {
    do {

      if audioEngine != nil && audioEngine.isRunning {
        stop()
      }
      
      initialize()
      try audioEngine.start()

    } catch {
      print("Error starting audio engine: \(error.localizedDescription)")
    }
  }
  
  @objc
  func stop() {
    if playerNode != nil  {
      playerNode.stop()
    }
    
    //disconnect audio nodes
    if inputNode != nil {
      inputNode.removeTap(onBus: 0)
      audioEngine.disconnectNodeInput(inputNode)
      audioEngine.disconnectNodeOutput(inputNode)
    }
    
    if playerNode != nil {
      audioEngine.disconnectNodeInput(playerNode)
      audioEngine.disconnectNodeOutput(playerNode)
    }
    
    audioEngine.detach(playerNode)
  
    audioEngine.stop()
    audioEngine.reset()
  
    
    audioEngine = nil
    inputNode = nil
    playerNode = nil
  }

  private func processAudioBuffer(_ buffer: AVAudioPCMBuffer) throws -> [UInt8] {
  
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
      
      return bytes
      
    } catch {
      print("Error encoding data: \(error.localizedDescription)")
      return []
    }
  }
  
  @objc
  func playAudio(_ rawData: [UInt8]) {
    
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
      if (playerNode != nil || audioEngine != nil) {
        self.playerNode.scheduleBuffer(buffer, at: nil, completionHandler: nil)
        self.playerNode.play()
      }
     
    } catch {
      print("Error Decoding Audio Data \(error.localizedDescription)")
    }
  }
  
  @objc
  func toggleMute(_ setMute: Bool){
    self.muted = !setMute
  }
  
  //send audio buffer back to RN
  private func sendBufferToReactNative(opusAudio: [UInt8]) {
    sendEvent(withName: "opusAudio", body: ["buffer": opusAudio])
  }
}

