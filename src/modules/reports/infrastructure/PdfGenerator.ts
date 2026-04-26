import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { ImpactReportPDF } from "../templates/ImpactReportPDF";

export class PdfGenerator {
  static async generateImpactReport(data: any): Promise<ReadableStream> {
    // renderToStream returns a Node.js Readable. 
    // We cast it to any and adapt it to a Web ReadableStream for NextResponse
    const nodeStream = await renderToStream(React.createElement(ImpactReportPDF, { data }) as any);
    
    // Adaptador de Node Stream a Web Stream
    return new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      }
    });
  }
}
