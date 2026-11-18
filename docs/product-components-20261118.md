# Digital product design component study

The Product Design page uses the existing INTELLIGNCE typefaces, lavender/plum palette and owner artwork. The homepage is unchanged. The selected-work carousel now contains nine product/UIUX projects, retaining the homepage carousel styles and GSAP motion.

Reference pages inspected in a browser on 2026-11-18:

- https://ipod.framer.website/ — measured 200 × 340 shell, 170 × 170 click wheel, 60 × 60 centre button, recessed LCD, layered inset/drop shadows. Local implementation scales those dimensions together; the owner's four flagship products replace the music collection. Menu, previous/next, keyboard arrows, preview and outbound product controls work. No music or third-party playback is embedded.
- https://showcasecardpreview.framer.website/ — measured 390 × 318 closed shell, 370 × 260 image, outer 44/34 radii, image radius 34, layered 20px shadow. Three existing UIUX case studies use its image/caption/hover-preview treatment and an accessible expand/collapse details panel.
- https://service-card-ui.framer.website/ — measured 268 × 282 pinned note, 25px outer radius, 16px inset panel, pin offset shadow and five-layer directional card shadow. Hero uses a plum pin and lavender content panel with product-design scope.
- https://light-sparrow-852390.framer.app/ — macOS traffic lights, dark chrome/header separation, numbered syntax-highlighted code and copy feedback. The local snippet describes AppTech and the design workflow; it is selectable and copies as plain text.
- https://21st.dev/community/icons — inspected its consistent outline icon grid and generous spacing. Six meaningful design-discipline icons replace scattered brand-logo props.

The components are local HTML/CSS/JS adaptations of the inspected designs, not embedded Framer sites or imports of their original source modules. Content and styling are scoped to the Product Design page. Hero is arranged explicitly on desktop and flows into a two-column composition on mobile, keeping all six objects visible. Reduced motion and keyboard operation are supported.
