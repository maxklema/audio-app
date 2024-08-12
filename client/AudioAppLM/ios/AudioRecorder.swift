import Foundation
import AVFoundation
import React

@objc(AudioRecorder)
class AudioRecorder: NSObject, RCTBridgeModule {
  static func moduleName() -> String {
    return "AudioRecorder"
  }

  private var recorder: AVAudioRecorder?
  private var player: AVAudioPlayer?;
  private var fileURL: URL?

  @objc
  func startRecording() {
  
    let fileManager: FileManager = FileManager.default
    let tempDirectory: URL = fileManager.temporaryDirectory
    fileURL = tempDirectory.appendingPathComponent("audio.m4a")

    let settings: [String: Any] = [
      AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
      AVSampleRateKey: 48000.0,
      AVNumberOfChannelsKey: 1,
      AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
    ]

    do {
      try AVAudioSession.sharedInstance().setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .mixWithOthers, .allowBluetooth])
      try AVAudioSession.sharedInstance().setActive(true)

      recorder = try AVAudioRecorder(url: fileURL!, settings: settings)
      recorder?.record()

    } catch {
      print("Failed to start recording: \(error.localizedDescription)")
    }
  }
  
  @objc
  func playAudio() {

    let fileManager: FileManager = FileManager.default
    let tempDirectory: URL = fileManager.temporaryDirectory
    let fileURL: URL = tempDirectory.appendingPathComponent("audio.m4a");
    
    do {
      player = try AVAudioPlayer(contentsOf: fileURL)
      player?.prepareToPlay()
      player?.isMeteringEnabled = true
      player?.volume = 0.5
      player?.play()
      
    } catch {
      print("Error playing audio: \(error.self)")
    }
  }
  
  @objc 
  func toggleVolume(_ playerVolume: Float) {
      print(playerVolume)
      player?.volume = playerVolume
  }

  @objc
  func stopRecording() {
    recorder?.stop()
  }

}
