export async function simulateNotification({ userId, alerts }) {
  const routedAlerts = alerts.filter((alert) => alert.notifyCaregiver);

  for (const alert of routedAlerts) {
    console.log(
      `[SIMULATED_NOTIFICATION] user=${userId} severity=${alert.severity} title="${alert.title}"`
    );
  }

  return {
    sent: routedAlerts.length,
    channels: routedAlerts.length > 0 ? ["ui", "caregiver-sms-sim", "email-sim"] : ["ui"],
  };
}
