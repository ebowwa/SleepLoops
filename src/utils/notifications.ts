import * as Notifications from 'expo-notifications';

/**
 * Configure notification handler to allow alerts and sounds when app is in foreground.
 */
export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Generic schedule function for any notification content and trigger.
 */
export async function scheduleNotification(
  content: Notifications.NotificationContentInput,
  trigger: Notifications.NotificationTriggerInput | null
): Promise<string> {
  return Notifications.scheduleNotificationAsync({ content, trigger });
}

/**
 * Creates a time interval trigger input for scheduling notifications.
 */
export function createTimeIntervalTrigger(
  seconds: number,
  repeats = false
): Notifications.NotificationTriggerInput {
  // Casting to NotificationTriggerInput to satisfy required type
  return { type: 'timeInterval', seconds, repeats } as Notifications.NotificationTriggerInput;
}

/**
 * Trigger a local notification immediately or via scheduling (null trigger).
 * @param options.content Notification content
 * @param options.schedule If true, use scheduleNotification with null trigger (legacy). Default false.
 */
export async function triggerImmediateLocalNotification(
  options: { content?: Notifications.NotificationContentInput; schedule?: boolean } = {}
): Promise<string> {
  const { content, schedule = false } = options;
  const finalContent: Notifications.NotificationContentInput =
    content || { title: 'Immediate Notification', body: 'This is triggered now' };
  if (schedule) {
    // Legacy behavior: schedule immediately with null trigger
    return scheduleNotification(finalContent, null);
  }
  // Present immediately in foreground
  // @ts-ignore: presentNotificationAsync may not be in typings
  return Notifications.presentNotificationAsync(finalContent);
}
