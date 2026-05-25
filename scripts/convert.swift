import Foundation
import AVFoundation

let args = CommandLine.arguments
if args.count < 3 {
    print("Usage: convert.swift <input> <output>")
    exit(1)
}

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])

let asset = AVAsset(url: inputURL)

guard let exportSession = AVAssetExportSession(asset: asset, presetName: AVAssetExportPreset1280x720) else {
    print("Could not create export session.")
    exit(1)
}

exportSession.outputURL = outputURL
exportSession.outputFileType = .mp4
exportSession.shouldOptimizeForNetworkUse = true

let semaphore = DispatchSemaphore(value: 0)

exportSession.exportAsynchronously {
    semaphore.signal()
}

semaphore.wait()

if exportSession.status == .completed {
    print("Export completed successfully.")
} else if let error = exportSession.error {
    print("Export failed: \(error.localizedDescription)")
    exit(1)
}
