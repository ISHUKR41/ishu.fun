/**
 * tools-data.ts - PDF Tools Database
 * 
 * Contains the complete list of all 100+ PDF tools available on the platform.
 * Each tool has a slug (URL path), display name, description, category, and icon.
 * 
 * Categories: Video Tools, Convert, Edit, Organize, Security, AI & Others
 * 
 * This data is used by:
 * - ToolsPage.tsx (main tools listing with search/filter)
 * - ToolPage.tsx (individual tool page)
 * - ToolsPreview.tsx (home page tools showcase)
 * - Footer.tsx (popular tools links)
 */

// Shape of each tool entry
export interface ToolData {
  slug: string;
  name: string;
  desc: string;
  category: string;
  icon: string;
}

export const allToolsData: ToolData[] = [
  // Video Tools (NEW — Featured)
  { slug: "youtube-downloader", name: "YouTube Downloader", desc: "Download YouTube videos in HD quality with preview. Paste URL, select quality, and download instantly — 100% free.", category: "Video Tools", icon: "Youtube" },
  { slug: "terabox-downloader", name: "Terabox Downloader", desc: "Download Terabox videos and files with preview. Fast, free direct download links from any Terabox share URL.", category: "Video Tools", icon: "Cloud" },
  { slug: "universal-video-downloader", name: "Universal Video Downloader", desc: "Download videos from YouTube, Instagram, TikTok, Twitter/X, Facebook, Reddit, Vimeo & 1000+ platforms. Quality selection & audio extract.", category: "Video Tools", icon: "Globe" },

  // PDF Operations
  { slug: "merge-pdf", name: "Merge PDF", desc: "Combine PDFs in the order you want with the easiest PDF merger available.", category: "Organize", icon: "Merge" },
  { slug: "split-pdf", name: "Split PDF", desc: "Separate one page or a whole set for easy conversion into independent PDF files.", category: "Organize", icon: "Scissors" },
  { slug: "compress-pdf", name: "Compress PDF", desc: "Reduce file size while optimizing for maximal PDF quality.", category: "Edit", icon: "FileDown" },
  { slug: "organize-pdf", name: "Organize PDF", desc: "Sort pages of your PDF file however you like. Delete or add pages at your convenience.", category: "Organize", icon: "Layers" },
  { slug: "rotate-pdf", name: "Rotate PDF", desc: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!", category: "Organize", icon: "RotateCw" },
  { slug: "crop-pdf", name: "Crop PDF", desc: "Crop margins of PDF documents or select specific areas.", category: "Edit", icon: "Crop" },
  { slug: "delete-pages", name: "Delete Pages", desc: "Remove unwanted pages from your PDF document easily.", category: "Organize", icon: "Trash2" },
  { slug: "rearrange-pages", name: "Rearrange Pages", desc: "Reorder PDF pages by dragging and dropping.", category: "Organize", icon: "ArrowUpDown" },
  { slug: "extract-pages", name: "Extract Pages", desc: "Extract specific pages from a PDF into a new file.", category: "Organize", icon: "FileOutput" },

  // PDF Conversion - To PDF
  { slug: "word-to-pdf", name: "Word to PDF", desc: "Make DOC and DOCX files easy to read by converting them to PDF.", category: "Convert", icon: "FileText" },
  { slug: "powerpoint-to-pdf", name: "PowerPoint to PDF", desc: "Make PPT and PPTX slideshows easy to view by converting them to PDF.", category: "Convert", icon: "Presentation" },
  { slug: "excel-to-pdf", name: "Excel to PDF", desc: "Make EXCEL spreadsheets easy to read by converting them to PDF.", category: "Convert", icon: "Table" },
  { slug: "jpg-to-pdf", name: "JPG to PDF", desc: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.", category: "Convert", icon: "Image" },
  { slug: "png-to-pdf", name: "PNG to PDF", desc: "Convert PNG images to PDF format quickly and easily.", category: "Convert", icon: "Image" },
  { slug: "image-to-pdf", name: "Image to PDF", desc: "Convert any image format to PDF document.", category: "Convert", icon: "Image" },
  { slug: "html-to-pdf", name: "HTML to PDF", desc: "Convert webpages in HTML to PDF. Copy and paste the URL and convert with a click.", category: "Convert", icon: "Globe" },
  { slug: "url-to-pdf", name: "URL to PDF", desc: "Convert any webpage URL directly to a PDF document.", category: "Convert", icon: "Link" },
  { slug: "docx-to-pdf", name: "DOCX to PDF", desc: "Convert DOCX documents to PDF format.", category: "Convert", icon: "FileText" },
  { slug: "pptx-to-pdf", name: "PPTX to PDF", desc: "Convert PPTX presentations to PDF format.", category: "Convert", icon: "Presentation" },
  { slug: "epub-to-pdf", name: "EPUB to PDF", desc: "Convert EPUB eBooks to PDF format.", category: "Convert", icon: "BookOpen" },
  { slug: "txt-to-pdf", name: "TXT to PDF", desc: "Convert plain text files to PDF documents.", category: "Convert", icon: "Type" },
  { slug: "odt-to-pdf", name: "ODT to PDF", desc: "Convert OpenDocument text to PDF.", category: "Convert", icon: "FileText" },
  { slug: "rtf-to-pdf", name: "RTF to PDF", desc: "Convert Rich Text Format to PDF.", category: "Convert", icon: "FileText" },
  { slug: "csv-to-pdf", name: "CSV to PDF", desc: "Convert CSV spreadsheets to PDF tables.", category: "Convert", icon: "Table" },
  { slug: "svg-to-pdf", name: "SVG to PDF", desc: "Convert SVG vector graphics to PDF.", category: "Convert", icon: "Pen" },
  { slug: "heic-to-pdf", name: "HEIC to PDF", desc: "Convert Apple HEIC photos to PDF.", category: "Convert", icon: "Image" },
  { slug: "heif-to-pdf", name: "HEIF to PDF", desc: "Convert HEIF images to PDF format.", category: "Convert", icon: "Image" },
  { slug: "webp-to-pdf", name: "WebP to PDF", desc: "Convert WebP images to PDF.", category: "Convert", icon: "Image" },
  { slug: "bmp-to-pdf", name: "BMP to PDF", desc: "Convert BMP bitmap images to PDF.", category: "Convert", icon: "Image" },
  { slug: "tiff-to-pdf", name: "TIFF to PDF", desc: "Convert TIFF images to PDF documents.", category: "Convert", icon: "Image" },
  { slug: "gif-to-pdf", name: "GIF to PDF", desc: "Convert GIF images to PDF.", category: "Convert", icon: "Image" },
  { slug: "jfif-to-pdf", name: "JFIF to PDF", desc: "Convert JFIF images to PDF.", category: "Convert", icon: "Image" },
  { slug: "djvu-to-pdf", name: "DjVu to PDF", desc: "Convert DjVu documents to PDF.", category: "Convert", icon: "FileText" },
  { slug: "pages-to-pdf", name: "PAGES to PDF", desc: "Convert Apple Pages to PDF.", category: "Convert", icon: "FileText" },
  { slug: "mobi-to-pdf", name: "MOBI to PDF", desc: "Convert MOBI eBooks to PDF.", category: "Convert", icon: "BookOpen" },
  { slug: "xml-to-pdf", name: "XML to PDF", desc: "Convert XML documents to PDF.", category: "Convert", icon: "Code" },
  { slug: "md-to-pdf", name: "MD to PDF", desc: "Convert Markdown files to PDF.", category: "Convert", icon: "FileCode" },
  { slug: "ebook-to-pdf", name: "eBook to PDF", desc: "Convert any eBook format to PDF.", category: "Convert", icon: "BookOpen" },
  { slug: "dwg-to-pdf", name: "DWG to PDF", desc: "Convert AutoCAD DWG files to PDF.", category: "Convert", icon: "Ruler" },
  { slug: "dxf-to-pdf", name: "DXF to PDF", desc: "Convert DXF CAD files to PDF.", category: "Convert", icon: "Ruler" },
  { slug: "pub-to-pdf", name: "PUB to PDF", desc: "Convert Microsoft Publisher to PDF.", category: "Convert", icon: "FileText" },
  { slug: "xps-to-pdf", name: "XPS to PDF", desc: "Convert XPS documents to PDF.", category: "Convert", icon: "FileText" },
  { slug: "hwp-to-pdf", name: "HWP to PDF", desc: "Convert Hangul HWP to PDF.", category: "Convert", icon: "FileText" },
  { slug: "chm-to-pdf", name: "CHM to PDF", desc: "Convert CHM help files to PDF.", category: "Convert", icon: "FileText" },
  { slug: "fb2-to-pdf", name: "FB2 to PDF", desc: "Convert FictionBook to PDF.", category: "Convert", icon: "BookOpen" },
  { slug: "wps-to-pdf", name: "WPS to PDF", desc: "Convert WPS documents to PDF.", category: "Convert", icon: "FileText" },
  { slug: "eml-to-pdf", name: "EML to PDF", desc: "Convert email EML files to PDF.", category: "Convert", icon: "Mail" },
  { slug: "zip-to-pdf", name: "ZIP to PDF", desc: "Convert ZIP archives contents to PDF.", category: "Convert", icon: "Archive" },
  { slug: "cbz-to-pdf", name: "CBZ to PDF", desc: "Convert comic book CBZ to PDF.", category: "Convert", icon: "BookOpen" },
  { slug: "cbr-to-pdf", name: "CBR to PDF", desc: "Convert comic book CBR to PDF.", category: "Convert", icon: "BookOpen" },
  { slug: "ai-to-pdf", name: "AI to PDF", desc: "Convert Adobe Illustrator AI to PDF.", category: "Convert", icon: "Pen" },

  // PDF Conversion - From PDF
  { slug: "pdf-to-word", name: "PDF to Word", desc: "Easily convert your PDF files into easy to edit DOC and DOCX documents.", category: "Convert", icon: "FileUp" },
  { slug: "pdf-to-powerpoint", name: "PDF to PowerPoint", desc: "Turn your PDF files into easy to edit PPT and PPTX slideshows.", category: "Convert", icon: "Presentation" },
  { slug: "pdf-to-excel", name: "PDF to Excel", desc: "Pull data straight from PDFs into Excel spreadsheets in a few short seconds.", category: "Convert", icon: "Table" },
  { slug: "pdf-to-jpg", name: "PDF to JPG", desc: "Convert each PDF page into a JPG or extract all images contained in a PDF.", category: "Convert", icon: "Image" },
  { slug: "pdf-to-png", name: "PDF to PNG", desc: "Convert PDF pages to PNG images.", category: "Convert", icon: "Image" },
  { slug: "pdf-to-image", name: "PDF to Image", desc: "Convert PDF to various image formats.", category: "Convert", icon: "Image" },
  { slug: "pdf-to-html", name: "PDF to HTML", desc: "Convert PDF documents to HTML web pages.", category: "Convert", icon: "Globe" },
  { slug: "pdf-to-docx", name: "PDF to DOCX", desc: "Convert PDF to editable DOCX format.", category: "Convert", icon: "FileText" },
  { slug: "pdf-to-epub", name: "PDF to EPUB", desc: "Convert PDF to EPUB eBook format.", category: "Convert", icon: "BookOpen" },
  { slug: "pdf-to-txt", name: "PDF to TXT", desc: "Extract text from PDF into plain text files.", category: "Convert", icon: "Type" },
  { slug: "pdf-to-odt", name: "PDF to ODT", desc: "Convert PDF to OpenDocument text.", category: "Convert", icon: "FileText" },
  { slug: "pdf-to-rtf", name: "PDF to RTF", desc: "Convert PDF to Rich Text Format.", category: "Convert", icon: "FileText" },
  { slug: "pdf-to-csv", name: "PDF to CSV", desc: "Extract table data from PDF to CSV.", category: "Convert", icon: "Table" },
  { slug: "pdf-to-svg", name: "PDF to SVG", desc: "Convert PDF to SVG vector format.", category: "Convert", icon: "Pen" },
  { slug: "pdf-to-bmp", name: "PDF to BMP", desc: "Convert PDF pages to BMP images.", category: "Convert", icon: "Image" },
  { slug: "pdf-to-tiff", name: "PDF to TIFF", desc: "Convert PDF to TIFF image format.", category: "Convert", icon: "Image" },
  { slug: "pdf-to-gif", name: "PDF to GIF", desc: "Convert PDF pages to GIF images.", category: "Convert", icon: "Image" },
  { slug: "pdf-to-mobi", name: "PDF to MOBI", desc: "Convert PDF to Kindle MOBI format.", category: "Convert", icon: "BookOpen" },
  { slug: "pdf-to-pdfa", name: "PDF to PDF/A", desc: "Transform your PDF to PDF/A, the ISO-standardized version for long-term archiving.", category: "Convert", icon: "Archive" },
  { slug: "pdf-to-ppt", name: "PDF to PPT", desc: "Convert PDF to PowerPoint presentation.", category: "Convert", icon: "Presentation" },
  { slug: "pdf-converter", name: "PDF Converter", desc: "Universal PDF converter — convert to and from any format.", category: "Convert", icon: "RefreshCw" },

  // Edit & Annotate
  { slug: "edit-pdf", name: "Edit PDF", desc: "Add text, images, shapes or freehand annotations to a PDF document.", category: "Edit", icon: "FileEdit" },
  { slug: "edit-pdf-text", name: "Edit PDF Text", desc: "Edit existing text directly in your PDF document.", category: "Edit", icon: "Type" },
  { slug: "add-text", name: "Add Text", desc: "Add new text content to your PDF pages.", category: "Edit", icon: "Type" },
  { slug: "add-image-to-pdf", name: "Add Image to PDF", desc: "Insert images into your PDF document.", category: "Edit", icon: "ImagePlus" },
  { slug: "sign-pdf", name: "Sign PDF", desc: "Sign yourself or request electronic signatures from others.", category: "Edit", icon: "PenTool" },
  { slug: "watermark", name: "Watermark", desc: "Stamp an image or text over your PDF in seconds.", category: "Edit", icon: "Stamp" },
  { slug: "page-numbers", name: "Page Numbers", desc: "Add page numbers into PDFs with ease.", category: "Edit", icon: "Hash" },
  { slug: "header-and-footer", name: "Header & Footer", desc: "Add custom headers and footers to PDF pages.", category: "Edit", icon: "AlignVerticalJustifyStart" },
  { slug: "annotate-pdf", name: "Annotate PDF", desc: "Add annotations and comments to your PDF.", category: "Edit", icon: "MessageSquare" },
  { slug: "highlight-pdf", name: "Highlight PDF", desc: "Highlight important text in your PDF document.", category: "Edit", icon: "Highlighter" },
  { slug: "pdf-filler", name: "PDF Filler", desc: "Fill out PDF forms digitally.", category: "Edit", icon: "FormInput" },

  // Security
  { slug: "protect-pdf", name: "Protect PDF", desc: "Protect PDF files with a password. Encrypt PDF documents.", category: "Security", icon: "Lock" },
  { slug: "unlock-pdf", name: "Unlock PDF", desc: "Remove PDF password security, giving you the freedom to use your PDFs.", category: "Security", icon: "Unlock" },
  { slug: "redact-pdf", name: "Redact PDF", desc: "Redact text and graphics to permanently remove sensitive information.", category: "Security", icon: "EyeOff" },
  { slug: "flatten-pdf", name: "Flatten PDF", desc: "Flatten PDF form fields and annotations.", category: "Security", icon: "Layers" },
  { slug: "remove-metadata", name: "Remove Metadata", desc: "Strip all metadata from your PDF files.", category: "Security", icon: "Shield" },
  { slug: "edit-metadata", name: "Edit Metadata", desc: "Edit PDF document metadata and properties.", category: "Security", icon: "Settings" },

  // Others / AI
  { slug: "ocr-pdf", name: "OCR PDF", desc: "Easily convert scanned PDF into searchable and selectable documents.", category: "AI & Others", icon: "ScanLine" },
  { slug: "compare-pdf", name: "Compare PDF", desc: "Show a side-by-side document comparison and easily spot changes.", category: "AI & Others", icon: "FileSearch" },
  { slug: "translate-pdf", name: "Translate PDF", desc: "Easily translate PDF files powered by AI. Keep layout perfectly intact.", category: "AI & Others", icon: "Languages" },
  { slug: "chat-with-pdf", name: "Chat with PDF", desc: "Ask questions about your PDF and get instant AI-powered answers.", category: "AI & Others", icon: "MessageCircle" },
  { slug: "summarize", name: "Summarize PDF", desc: "Get an AI-powered summary of your PDF document.", category: "AI & Others", icon: "FileText" },
  { slug: "repair-pdf", name: "Repair PDF", desc: "Repair a damaged PDF and recover data from corrupt PDF.", category: "AI & Others", icon: "Wrench" },
  { slug: "scan-to-pdf", name: "Scan to PDF", desc: "Capture document scans from your mobile device.", category: "AI & Others", icon: "Camera" },
  { slug: "pdf-viewer", name: "PDF Viewer", desc: "View PDF documents directly in your browser.", category: "AI & Others", icon: "Eye" },
  { slug: "create-pdf", name: "Create PDF", desc: "Create a new PDF document from scratch.", category: "AI & Others", icon: "FilePlus" },
  { slug: "resize-pages", name: "Resize Pages", desc: "Change the page size of your PDF document.", category: "AI & Others", icon: "Maximize" },
  { slug: "extract-text", name: "Extract Text", desc: "Extract all text content from a PDF.", category: "AI & Others", icon: "Type" },
  { slug: "extract-images", name: "Extract Images", desc: "Extract all images from a PDF document.", category: "AI & Others", icon: "Image" },
  { slug: "whiteout-pdf", name: "Whiteout PDF", desc: "White out content in your PDF to hide information.", category: "AI & Others", icon: "Square" },
  { slug: "grayscale-pdf", name: "Grayscale PDF", desc: "Convert color PDF to grayscale/black-and-white.", category: "AI & Others", icon: "Contrast" },
];

export const toolCategories = ["All", "Video Tools", "Convert", "Edit", "Organize", "Security", "AI & Others"];
