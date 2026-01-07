# ✅ FIXED: Mobile PDF Viewing

## Issue
PDFs were not displaying correctly in the ChemSnaps popup on mobile devices. The previous implementation used an `<iframe>` which is often blocked or not supported for inline PDF display on iOS and Android browsers.

## Solution
Integrated **PDF.js** to render PDFs as images on mobile devices, matching the implementation in the Puzzles page.

### Changes in `src/pages/ChemSnaps.jsx`:
1.  **Added Imports**:
    ```javascript
    import * as pdfjsLib from 'pdfjs-dist';
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    ```
2.  **Added Mobile State & Logic**:
    - `isMobile`: Detects if the user is on a mobile device.
    - `loadPdfForMobile(url)`: Fetches the PDF and renders each page to a canvas, then converts to an image used for display.
3.  **Conditional Rendering**:
    - **Mobile**: Renders a scrollable list of images (PDF pages).
    - **Desktop**: Renders the standard `<iframe>` viewer (with scrollbars enabled).

## Verification
1.  Open ChemSnaps on a mobile device (or use browser DevTools mobile emulation).
2.  Click "View" on a PDF ChemSnap.
3.  Verify that the PDF pages load as images and are scrollable.
