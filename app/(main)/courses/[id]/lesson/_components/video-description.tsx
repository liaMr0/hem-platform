// _components/video-description.tsx (actualizado)
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileText, Image, Video } from "lucide-react";

interface Document {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

interface VideoDescriptionProps {
  description: string;
  courseId: string;
  documents: Document[];
}

function VideoDescription({ description, courseId, documents }: VideoDescriptionProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <Image className="h-4 w-4" />;
    if (fileType.includes('video')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="mt-4">
      <Tabs defaultValue="details">
        <TabsList className="bg-transparent p-0 border-b border-border w-full justify-start h-auto rounded-none">
          <TabsTrigger className="capitalize" value="details">
            Descripción
          </TabsTrigger>
          {documents && documents.length > 0 && (
            <TabsTrigger className="capitalize" value="documents">
              Documentos ({documents.length})
            </TabsTrigger>
          )}
        </TabsList>
        <div className="pt-3">
          <TabsContent value="details">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          </TabsContent>
          
          {documents && documents.length > 0 && (
            <TabsContent value="documents">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Documentos del curso</h3>
                <div className="grid gap-3">
                  {documents.map((doc, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {getFileIcon(doc.fileType)}
                        <div>
                          <p className="font-medium text-gray-900">{doc.fileName}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(doc.fileSize)} • {doc.fileType}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc.fileUrl, doc.fileName)}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Descargar</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div> 
  );
}

export default VideoDescription;