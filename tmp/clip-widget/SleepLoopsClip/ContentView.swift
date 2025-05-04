//
//  ContentView.swift
//  SleepLoopsClip
//
//  Created by Elijah Arbee on 4/27/25.
//

import SwiftUI

enum UserAction {
    case wake
    case sleep
}

struct ContentView: View {
    @State private var showModal = true
    @State private var selection: UserAction? = nil

    private var suggestions: [Date] {
        guard selection != nil else { return [] }
        let now = Date()
        let cycle = 90 * 60.0
        let fallAsleep = 15 * 60.0
        return (1...6).map { i in
            now.addingTimeInterval(Double(i) * cycle + fallAsleep)
        }
    }

    private func formatted(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        formatter.dateStyle = .none
        return formatter.string(from: date)
    }

    var body: some View {
        VStack(spacing: 20) {
            if let selection = selection {
                Text(LocalizedStringKey(selection == .wake ? "header_sleep" : "header_wake"))
                    .font(.headline)
                VStack(alignment: .leading, spacing: 10) {
                    ForEach(suggestions, id: \.self) { date in
                        HStack(spacing: 12) {
                            Image(systemName: "alarm")
                                .foregroundColor(.accentColor)
                            Text(formatted(date))
                                .font(.title2)
                        }
                        .padding(.vertical, 4)
                    }
                }
                Link(LocalizedStringKey("download_app"), destination: URL(string: "https://apps.apple.com/app/idYOUR_APP_ID")!)
                    .buttonStyle(.borderedProminent)
                    .padding(.top, 16)
            }
        }
        .sheet(isPresented: $showModal) {
            VStack(spacing: 20) {
                Text(LocalizedStringKey("choose_action"))
                    .font(.headline)
                HStack(spacing: 20) {
                    Button(LocalizedStringKey("wake_button")) {
                        selection = .wake
                        showModal = false
                    }
                    .buttonStyle(.borderedProminent)
                    Button(LocalizedStringKey("sleep_button")) {
                        selection = .sleep
                        showModal = false
                    }
                    .buttonStyle(.borderedProminent)
                }
                .padding()
            }
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
