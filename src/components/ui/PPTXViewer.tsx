import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Maximize2,
  Download,
  X,
  Presentation,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PPTXViewerProps {
  url: string;
  fileName: string;
  onClose?: () => void;
  onDownload?: () => void;
  embedded?: boolean;
}

export function PPTXViewer({
  url,
  fileName,
  onClose,
  onDownload,
  embedded = false,
}: PPTXViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Microsoft Office Online viewer URL
  // Note: This works for publicly accessible URLs
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  const openInNewTab = () => {
    window.open(
      `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 bg-background flex flex-col"
    : embedded
    ? "flex flex-col h-[500px]"
    : "flex flex-col h-[500px]";

  return (
    <div className={containerClass}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <Presentation className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate max-w-[200px]">
            {fileName}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={openInNewTab}
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Open in new tab</span>
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

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

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-muted/30 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading presentation...</p>
            </div>
          </div>
        )}

        {error ? (
          <div className="h-full flex flex-col items-center justify-center">
            <Presentation className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Unable to preview presentation</p>
            <p className="text-xs text-muted-foreground mb-4 max-w-md text-center">
              The file may not be publicly accessible or the format is not supported for online preview.
            </p>
            <div className="flex gap-2">
              {onDownload && (
                <Button onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PPTX
                </Button>
              )}
              <Button variant="outline" onClick={openInNewTab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Try Office Online
              </Button>
            </div>
          </div>
        ) : (
          <iframe
            src={officeViewerUrl}
            title="PowerPoint Presentation"
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        )}
      </div>

      {/* Info bar */}
      <div className="px-4 py-2 bg-muted/50 border-t border-border flex-shrink-0">
        <p className="text-xs text-muted-foreground text-center">
          Powered by Microsoft Office Online • For best experience, use a modern browser
        </p>
      </div>

      {/* Fullscreen hint */}
      {isFullscreen && (
        <div className="absolute top-16 right-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-muted-foreground border border-border">
          Press ESC or click × to exit fullscreen
        </div>
      )}
    </div>
  );
}
