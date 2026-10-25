# Safe Space

A free, no-login web tool that helps women respond to **online abuse**: sextortion and threats, fake profiles and morphed photos, leaked private images, and stalking.

Built for recHERsion'26, Problem Statement 2: Women's Safety.

## Problem
Most safety apps focus on street SOS buttons. Online abuse goes largely unreported because victims do not know what to save, where to report, or how to get content removed.

## Features
- Guided step-by-step flows for four situations: what to do now, what proof to save, where to report
- **Evidence vault**: SHA-256 fingerprint and timestamp for each screenshot, file or text, using the browser's Web Crypto API
- **Complaint writer**: generates a ready-to-paste complaint (for cybercrime.gov.in or a police station) that includes the evidence list; print or save as PDF
- **Device and account check**: checklist for linked devices, unknown apps, location sharing
- Helplines page (112, 181, 1930, cybercrime.gov.in, StopNCII.org)
- **Quick exit** button on every screen, mobile-first layout, keyboard focus styles, dark mode

## Privacy by design
No server, no database, no analytics, no login. Everything stays in the browser (`localStorage`). Files are fingerprinted locally and never uploaded.

## Tech
Plain HTML, CSS and JavaScript. No frameworks or dependencies. Web Crypto API for hashing.

## Run
Open `index.html` in a browser, or host free on GitHub Pages.

## Limits and next steps
- Content is general information, not legal advice, and should be reviewed by a lawyer or NGO
- Planned: Hindi and Gujarati, offline mode (service worker), encrypted vault, PIN-protected disguise mode
