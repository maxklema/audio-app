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
      AVSampleRateKey: 96000,
      AVNumberOfChannelsKey: 1,
      AVEncoderAudioQualityKey: AVAudioQuality.max.rawValue
    ]

    do {
      recorder = try AVAudioRecorder(url: fileURL!, settings: settings)
      recorder?.record()

      //Prepare playback
      
      player = try AVAudioPlayer(contentsOf: fileURL!)
      player?.prepareToPlay()
      player?.play()

    } catch {
      print("Failed to start recording: \(error.localizedDescription)")
    }

  }
  
  @objc
  func playAudio() {
    let fileManager: FileManager = FileManager.default
    let tempDirectory: URL = fileManager.temporaryDirectory
    let fileURL = tempDirectory.appendingPathComponent("audio.m4a");
    
    do {
      player = try AVAudioPlayer(contentsOf: fileURL)
      player?.prepareToPlay()
      player?.play()
      print("Playback started")
    } catch {
      print("Error playing audio: \(error.self)")
    }
  }

  @objc
  func stopRecording() {
    recorder?.stop()
    player?.stop()
  }

}

