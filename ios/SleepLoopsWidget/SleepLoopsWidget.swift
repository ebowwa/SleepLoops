//
//  SleepLoopsWidget.swift
//  SleepLoopsWidget
//
//  Created by Elijah Arbee on 4/27/25.
//

import WidgetKit
import SwiftUI

// Model for cycle suggestion
struct CycleSuggestion {
    let cycles: Int
    let time: Date
}

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        let now = Date()
        let suggestions = [3,4,5].map { c in CycleSuggestion(cycles: c, time: now.addingTimeInterval(Double((c*90+15) * 60))) }
        return SimpleEntry(date: now, suggestions: suggestions)
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        placeholder(in: context)
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        let now = Date()
        let suggestions = [3,4,5].map { c in CycleSuggestion(cycles: c, time: now.addingTimeInterval(Double((c*90+15) * 60))) }
        let entry = SimpleEntry(date: now, suggestions: suggestions)
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: now)!
        return Timeline(entries: [entry], policy: .after(nextUpdate))
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let suggestions: [CycleSuggestion]
}

struct SleepLoopsWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Header with icon
            HStack(spacing: 6) {
                Image(systemName: "bed.double.fill")
                    .font(.title2)
                    .foregroundColor(.accentColor)
                Text("Up Next")
                    .font(.headline)
                    .foregroundColor(.primary)
            }
            Divider()
            // Cycle entries
            ForEach(entry.suggestions, id: \.cycles) { suggestion in
                HStack {
                    Text("\(suggestion.cycles) cycles")
                        .font(.subheadline)
                        .foregroundColor(.primary)
                    Spacer()
                    Text(suggestion.time, style: .time)
                        .font(.subheadline)
                        .foregroundColor(.primary)
                }
            }
            Spacer()
        }
        .padding(12)
        // Deep link tapping the first suggestion
        .widgetURL(
            URL(string: "sleeploops://schedule?time=\(Int(entry.suggestions.first?.time.timeIntervalSince1970 ?? 0))")
        )
    }
}

struct SleepLoopsWidget: Widget {
    let kind: String = "SleepLoopsWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            SleepLoopsWidgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
                .containerBackground(for: .widget) {
                    Color(.systemBackground)
                }
        }
        .configurationDisplayName("Cycle Suggestions")
        .description("Upcoming wake-up suggestions based on 90-minute sleep cycles.")
        .supportedFamilies([.systemMedium])
    }
}

#Preview(as: .systemMedium) {
    SleepLoopsWidget()
} timeline: {
    SimpleEntry(date: .now, suggestions: [
        CycleSuggestion(cycles: 3, time: .now.addingTimeInterval(Double((3*90+15)*60))),
        CycleSuggestion(cycles: 4, time: .now.addingTimeInterval(Double((4*90+15)*60))),
        CycleSuggestion(cycles: 5, time: .now.addingTimeInterval(Double((5*90+15)*60)))
    ])
}
