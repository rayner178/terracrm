import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { ImpactReportPDF } from "../templates/ImpactReportPDF";
import { ProjectReportPDF } from "../templates/ProjectReportPDF";

export class PdfGenerator {
  static async generateImpactReport(data: any): Promise<ReadableStream> {
    const nodeStream = await renderToStream(React.createElement(ImpactReportPDF, { data }) as any);
    return new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      }
    });
  }

  static async generateProjectReport(project: any): Promise<ReadableStream> {
    const nodeStream = await renderToStream(React.createElement(ProjectReportPDF, { project }) as any);
    return new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      }
    });
  }
}
