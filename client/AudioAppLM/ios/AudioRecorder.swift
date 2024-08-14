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
  
  private var masterBuffer: AVAudioPCMBuffer! //stores all audio for playback. Just for testing.
  private var bufferData: [Float] = []
  
  private var sampleRate: Double! //kHz
  private var channels: UInt32 = 1
  
  @objc
  override init() {
    super.init()
    audioEngine = AVAudioEngine()
    inputNode = audioEngine.inputNode
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
      resetBuffer();
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
  
  @objc
  func play() {
    do {
      try audioEngine.start()
      playerNode.scheduleBuffer(masterBuffer, at: nil, completionHandler: nil)
      self.playerNode.play()
      
    } catch {
      print("Error Playing Audio from Buffer: \(error.localizedDescription)")
    }
  }
  
  private func processAudioBuffer(_ buffer: AVAudioPCMBuffer) {
  
    let bufferSize = Int(buffer.frameLength)
    let newData = [Float](UnsafeBufferPointer(start: buffer.floatChannelData?[0], count: bufferSize))
    
    //apend new buffer data to master buffer
    
    bufferData.append(contentsOf: newData)
    
    let masterFormat = AVAudioFormat(
      commonFormat: .pcmFormatFloat32,
      sampleRate: sampleRate,
      channels: channels,
      interleaved: false
    )
    
    //initializing a master buffer
    if masterBuffer == nil {
      masterBuffer = AVAudioPCMBuffer(pcmFormat: masterFormat!, frameCapacity: AVAudioFrameCount(bufferData.count))
      masterBuffer?.frameLength = AVAudioFrameCount(bufferData.count)
      
      if let masterPointer = masterBuffer?.floatChannelData?[0] {
        memcpy(masterPointer, newData, bufferSize * MemoryLayout<Float>.size)
      }
    } else {
      
      // Update masterBuffer frame length
      let oldFrameLength = masterBuffer!.frameLength
      let newFrameLength = AVAudioFrameCount(bufferData.count)
      
      //check if master buffer needs resizing
      if newFrameLength > masterBuffer!.frameCapacity {
        
        let newCapacity = max(newFrameLength, masterBuffer!.frameCapacity * 2)
        let newMasterBuffer = AVAudioPCMBuffer(pcmFormat: masterFormat!, frameCapacity: newCapacity)
        newMasterBuffer!.frameLength = newFrameLength
        
        //copy existing data
        if let oldPointer = masterBuffer?.floatChannelData?[0], let newPointer = newMasterBuffer?.floatChannelData?[0] {
            memcpy(newPointer, oldPointer, Int(oldFrameLength) * MemoryLayout<Float>.size)
        }
        
        //copy new data
        if let newPointer = newMasterBuffer?.floatChannelData?[0] {
          memcpy(newPointer + Int(oldFrameLength), newData, bufferSize * MemoryLayout<Float>.size)
        }
        
        masterBuffer = newMasterBuffer
      
      } else {
        
        //directly append data if no re-sizing needed
        if let masterPointer = masterBuffer?.floatChannelData?[0] {
          let oldPointer = masterPointer  + Int(oldFrameLength)
          memcpy(oldPointer, newData, bufferSize * MemoryLayout<Float>.size)
        }
        
        masterBuffer?.frameLength = newFrameLength
        
      }
      
    }
    
  }
  
  //clears the buffer
  private func resetBuffer() {
    bufferData = []
    masterBuffer?.frameLength = 0
    
    if let masterPointer = masterBuffer?.floatChannelData?[0] {
      let bufferSize = Int(masterBuffer!.frameCapacity)
      memset(masterPointer, 0, bufferSize * MemoryLayout<Float>.size)
    }
    
  }

}
