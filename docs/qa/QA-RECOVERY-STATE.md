# Browser QA recovery checkpoint

Source corrections are durable at 916f34aaa3c1d9f39e2ab8fa9eacfd23333664f4. The earlier scratch session observed 198/198 PASS but lost unpublished results and receipt after an environment reset. Do not use that observation as current acceptance proof.

Fresh locked dependency installation and pinned Chromium restoration were necessary because their caches also disappeared. The fresh guarded build and actual rebuilt-app smoke passed. The current 198-case rerun is IN PROGRESS; browser-progress-checkpoint.json records only completed cases and explicitly marks the remainder unexecuted. Final source/export receipt verification and screenshot persistence are pending. Manifest STALE; release NO-GO. No deployment, main/recovery edits or live integrations.
