# Prototype verification

## Automated

`npm test` builds six content pages plus a 404 page and validates every generated local asset and internal link, local fragment targets, unique element IDs, one H1 per page, descriptions and titles, image alternative text, local font references, reduced-motion styling and visible-focus styling. No external test dependencies are required.

## Browser checks

- Desktop homepage visually inspected at the browser’s default 1280 × 720 viewport.
- Homepage inspected at 390 × 844; heading scale adjusted to retain the intended two-line composition.
- Home, Our approach, Programmes, Life at Jade, Visit and Privacy checked at 390 pixels wide without page-level horizontal overflow.
- Primary navigation and programme-specific enquiry links verified.
- Mobile menu opens, exposes navigation and closes when a destination is chosen.
- Gallery photo opens in a native modal dialog; Escape closes it and focus returns to the activating photo button.
- Nursery enquiry link preselects Nursery.
- Enquiry tested with non-personal test entries. It renders an accurate message preview and an encoded WhatsApp link; nothing was sent to the school.
- Editing the prepared enquiry preserves entered values.
- FAQ accordions use native details/summary controls.
- Date input rejects past dates; preferred dates are explicitly requests rather than booked slots.

## Limits

These checks are not a comprehensive accessibility certification, a multi-browser device lab, or a performance benchmark. Real devices, screen-reader use and operational admissions delivery should be included in an official launch review. The sample daily rhythm and operational unknowns are disclosed in the site. Current address and image permissions need school confirmation before an official relaunch.
