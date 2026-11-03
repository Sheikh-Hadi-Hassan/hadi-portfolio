# Error recovery

SeraFlowError supplies stable code, safe message and recovery action; invalid guided answers preserve state. Duplicate question IDs fail closed. Unknown guided schema versions deactivate the guided view while retaining core draft answers. UI rendering stores a typed guided error rather than exposing stack traces. errors.mjs defines provider, questionnaire, voice, pending lead/booking/notification and UI policies; uncertain writes have zero automatic retry. This policy core is tested but not fully wired into every old path.

Existing consent abort/late-result, contact transport and booking same-reference recovery remain. Notification delivery intents/quarantine are preserved. No retry or model switch may replay booking/mail side effects. Remaining: full corrupted-state migration fuzzing, every legacy voice error code, missing/dynamic asset recovery, stream handling and browser unhandled-rejection fault injection.
