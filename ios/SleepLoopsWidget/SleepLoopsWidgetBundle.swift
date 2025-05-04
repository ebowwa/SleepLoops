//
//  SleepLoopsWidgetBundle.swift
//  SleepLoopsWidget
//
//  Created by Elijah Arbee on 5/3/25.
//

import WidgetKit
import SwiftUI

@main
struct SleepLoopsWidgetBundle: WidgetBundle {
    var body: some Widget {
        SleepLoopsWidget()
        SleepLoopsWidgetControl()
        SleepLoopsWidgetLiveActivity()
    }
}
