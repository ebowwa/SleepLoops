//
//  SleepLoopsWidgetLiveActivity.swift
//  SleepLoopsWidget
//
//  Created by Elijah Arbee on 4/27/25.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct SleepLoopsWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct SleepLoopsWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: SleepLoopsWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension SleepLoopsWidgetAttributes {
    fileprivate static var preview: SleepLoopsWidgetAttributes {
        SleepLoopsWidgetAttributes(name: "World")
    }
}

extension SleepLoopsWidgetAttributes.ContentState {
    fileprivate static var smiley: SleepLoopsWidgetAttributes.ContentState {
        SleepLoopsWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: SleepLoopsWidgetAttributes.ContentState {
         SleepLoopsWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: SleepLoopsWidgetAttributes.preview) {
   SleepLoopsWidgetLiveActivity()
} contentStates: {
    SleepLoopsWidgetAttributes.ContentState.smiley
    SleepLoopsWidgetAttributes.ContentState.starEyes
}
