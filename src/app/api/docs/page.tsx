"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import spec from "./swagger.json";

export default function ApiDocsPage() {
  return (
    <div className="bg-white min-h-screen">
      <SwaggerUI spec={spec} />
    </div>
  );
}
