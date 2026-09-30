const { PDFParse } = require("pdf-parse");

const ApiError = require("../utils/ApiError");

function normalizeLink(link) {
  if (!link) return "";

  if (typeof link === "string") {
    return link.trim();
  }

  return (link.url || link.uri || link.href || "").trim();
}

async function extractText(buffer) {
  let parser;

  try {
    parser = new PDFParse({
      data: buffer,
    });

    /*
      1) Extract visible text
    */
    const textResult = await parser.getText();

    const text = (textResult.text || "").trim();

    if (text.length < 50) {
      throw new ApiError(
        400,
        "Extracted text is too short, possibly due to an invalid PDF file",
      );
    }

    /*
      2) Extract PDF metadata + embedded hyperlinks
    */
    const infoResult = await parser.getInfo({
      parsePageInfo: true,
    });

    const links = [];

    for (const page of infoResult.pages || []) {
      /*
        Depending on pdf-parse version,
        page links may be exposed as links,
        annotations, or a similar collection.
      */
      const pageLinks = page.links || page.annotations || [];

      for (const item of pageLinks) {
        const url = normalizeLink(item);

        if (!url) continue;

        /*
          Ignore duplicate URLs
        */
        if (!links.some((existing) => existing.url === url)) {
          links.push({
            url,
            page: page.pageNumber || page.page || null,
          });
        }
      }
    }

    /*
      Also scan any direct URL-looking text.
      This catches URLs such as portfolio links
      that are printed visibly in the PDF.
    */
    const urlRegex = /https?:\/\/[^\s<>"')\]]+/gi;

    const visibleUrls = text.match(urlRegex) || [];

    for (const rawUrl of visibleUrls) {
      const url = rawUrl.replace(/[.,;]+$/, "").trim();

      if (url && !links.some((existing) => existing.url === url)) {
        links.push({
          url,
          page: null,
        });
      }
    }

    return {
      text,

      links,

      meta: {
        numPages:
          textResult.pages?.length ??
          textResult.numpages ??
          infoResult.total ??
          null,

        info: infoResult.infoData || textResult.info || null,

        metadata: textResult.metadata || null,
      },
    };
  } catch (error) {
    if (error.isOperational) {
      throw error;
    }

    throw new ApiError(
      500,
      "Failed to extract text from PDF: " + error.message,
    );
  } finally {
    try {
      await parser?.destroy?.();
    } catch {}
  }
}

module.exports = {
  extractText,
};
