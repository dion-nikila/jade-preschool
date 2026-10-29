# Prototype verification

## Automated

`npm test` builds six content pages plus a 404 page and validates generated local assets and internal links, fragment targets, unique element IDs, one H1 per page, descriptions and titles, image alternative text, local font references, reduced-motion styling and visible-focus styling. No external test dependencies are required.

## Current visual revision

- Desktop homepage visually inspected at 1280 × 720.
- Homepage visually inspected at 390 × 844. The original school logo is displayed without clipping.
- The school, Programmes, Life at Jade, Visit and Privacy checked at 390 pixels wide without page-level horizontal overflow.
- Programme-page heading simplified after visual inspection on a phone.
- Original six-page navigation, native FAQ accordions, photo viewer and enquiry composer are retained.

## Interaction coverage

The enquiry composer and photo viewer were browser-tested during the first implementation. A programme-specific link preselected Nursery; the form produced an encoded WhatsApp message for review without sending it; editing preserved entries. The native photo dialog closed with Escape and returned focus to its trigger. The current templates retain the corresponding selectors and the same interaction code.

Local browser approval checks intermittently timed out during the current revision. Do not treat the earlier interaction checks as a complete new browser regression test. Automated build and link checks pass on the revised pages.

## Limits

These checks are not a comprehensive accessibility certification, a multi-browser device lab, or a performance benchmark. School information and photography permissions require school confirmation before an official relaunch.
