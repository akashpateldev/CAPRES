import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

interface PDFViewerProps {
  url: string;
  fileName: string;
  onClose?: () => void;
  onDownload?: () => void;
  embedded?: boolean;
}

export function PDFViewer({
  url,
  fileName,
  onClose,
  onDownload,
  embedded = false,
}: PDFViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 bg-background flex flex-col"
    : embedded
    ? "flex flex-col h-full"
    : "flex flex-col h-[500px]";

  return (
    <div className={containerClass}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate max-w-[200px]">
            {fileName}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Zoom controls */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 min-w-[60px]"
            onClick={handleResetZoom}
            title="Reset zoom"
          >
            {zoom}%
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Action buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          {onDownload && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onDownload}
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}

          {onClose && (
            <>
              <div className="w-px h-6 bg-border mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  if (isFullscreen) setIsFullscreen(false);
                  onClose();
                }}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-muted/50">
        <div
          className="min-h-full flex items-start justify-center p-4"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          {/* 
            Using object tag for PDF rendering - works in most modern browsers.
            The PDF is embedded directly without needing external libraries.
            Falls back to download link if browser doesn't support PDF viewing.
          */}
          <object
            data={`${url}#toolbar=0&navpanes=0&scrollbar=1`}
            type="application/pdf"
            className="w-full bg-white rounded-lg shadow-lg"
            style={{
              height: isFullscreen ? "calc(100vh - 100px)" : "600px",
              minHeight: "400px",
            }}
          >
            {/* Fallback for browsers that don't support embedded PDFs */}
            <div className="flex flex-col items-center justify-center h-96 bg-card rounded-lg border border-border">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Your browser doesn't support PDF preview
              </p>
              <Button onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </object>
        </div>
      </div>

      {/* Fullscreen close hint */}
      {isFullscreen && (
        <div className="absolute top-16 right-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-muted-foreground border border-border">
          Press ESC or click × to exit fullscreen
        </div>
      )}
    </div>
  );
}
