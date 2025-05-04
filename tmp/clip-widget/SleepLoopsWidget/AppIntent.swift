//
//  AppIntent.swift
//  SleepLoopsWidget
//
//  Created by Elijah Arbee on 4/27/25.
//

import WidgetKit
import AppIntents

struct ConfigurationAppIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource { "Configuration" }
    static var description: IntentDescription { "This is an example widget." }

    // An example configurable parameter.
    @Parameter(title: "Favorite Emoji", default: "😃")
    var favoriteEmoji: String
}

// MARK: - Sleep Cycle Intent

enum SleepCycleAction: String, AppEnum {
    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Sleep Cycle Action")
    case wake
    case sleep
    var displayRepresentation: DisplayRepresentation {
        switch self {
        case .wake: return .init(title: "Wake Times")
        case .sleep: return .init(title: "Bed Times")
        }
    }
}

/// Intent to compute sleep cycle suggestions.
struct ComputeSleepCycleIntent: AppIntent {
    static var title: LocalizedStringResource { "Compute Sleep Cycle Suggestions" }
    @Parameter(title: "Reference Date")
    var referenceDate: Date
    @Parameter(title: "Action", default: SleepCycleAction.wake)
    var action: SleepCycleAction
    @Parameter(title: "Cycle Counts", default: [3, 4, 5])
    var cycleCounts: [Int]
    @Parameter(title: "Buffer Minutes", default: 15)
    var bufferMinutes: Int

    static var description: LocalizedStringResource {
        "Compute sleep cycle times for a given date, action, cycles and buffer"
    }

    static var parameterSummary: some ParameterSummary {
        Summary("Compute \(\.$action) for \(\.$referenceDate) with cycles \(\.$cycleCounts) and buffer \(\.$bufferMinutes) minutes")
    }

    func perform() async throws -> some IntentResult & ReturnsValue<[Date]> {
        let cycleInterval = TimeInterval(90 * 60)
        let bufferInterval = TimeInterval(bufferMinutes * 60)
        let times = cycleCounts.map { cycle in
            let offset = cycleInterval * Double(cycle) + bufferInterval
            return action == .wake
                ? referenceDate.addingTimeInterval(offset)
                : referenceDate.addingTimeInterval(-offset)
        }
        return .result(value: times)
    }
}
