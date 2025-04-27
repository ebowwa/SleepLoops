//
//  SleepLoopsWidgetBundle.swift
//  SleepLoopsWidget
//
//  Created by Elijah Arbee on 4/27/25.
//

import WidgetKit
import SwiftUI

@main
struct SleepLoopsWidgetBundle: WidgetBundle {
    var body: some Widget {
        SleepLoopsWidget()
        WakeTimeSuggestionsWidget()
        SleepLoopsWidgetControl()
        SleepLoopsWidgetLiveActivity()
    }
}
