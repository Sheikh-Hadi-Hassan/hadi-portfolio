# Social preview image update

Prepared from verified production backup c4097990bccabea53af798eaf80012c239d6a418. The recovery branch and its original inventory remain unchanged. This feature branch is a derivative; use SOCIAL_PREVIEW_CHANGE.json for changed-file checksums alongside the original inventory for unchanged files.

Sets the supplied 1200 × 630 PNG as Open Graph and X/Twitter preview image on 17 public pages. Updates their exported Next.js metadata payloads to prevent navigation from restoring the old image. Adds image type, HTTPS URL, descriptive alt text, max-image-preview:large, and WebPage primaryImageOfPage structured data. Page-specific titles and descriptions, visible images, noindex pages, backend and integrations are preserved.

## Deployment status

NOT DEPLOYED. Hostinger restricts cloud-browser sign-in, so authenticated File Manager access is unavailable in this session. No live changes were made.

## Applying the change

First compare deployed files to the base production capture. If they differ, reconcile the metadata change against the current files instead of overwriting newer work. Upload the image before publishing the changed HTML and navigation payloads. Verify public image access, returned image/png type, 1200 × 630 dimensions, canonical URLs, metadata and navigation. Refresh platform preview caches only after deployment. Google automatically chooses result thumbnails; metadata cannot guarantee this image will appear everywhere.

## Rollback

Restore only modified files from recovery/verified-production-20261021 commit c4097990bccabea53af798eaf80012c239d6a418. The added image can remain unused. No secrets or configuration changes are required.

## Additional supplied image variants

Wide 1200 × 630 PNG remains the first Open Graph image, the Twitter large card image and the Google preferred-image hint. Square 1080 × 1080 JPEG and portrait 1080 × 1350 JPEG are derived from the two additional supplied PNGs, with no crop or artwork changes. They are optional second and third Open Graph images with correctly grouped dimensions, type and alt text, mirrored in navigation payloads. Platforms control selection and cropping; these are not platform-specific automatic routing rules. The portrait is also suitable as a separately attached social post asset. Deployment remains pending.

## Favicon update

Use supplied Intellignce-logo-22(1).webp as the favicon artwork, preserving its purple/white colors and transparency. Generated a six-size favicon.ico (16/32/48/64/128/256), PNG icons (32/192/512) and a 180px Apple touch icon. Updated HTML and navigation payload icon references. Original captured SVG remains untouched. Live deployment is still pending authenticated Hostinger access.
