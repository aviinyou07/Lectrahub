
import { useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Download, University, List } from "lucide-react";
import { useEffect, useState, useMemo  } from "react";
import { CONTENTS } from "@/utils/apis";

const Content = () => {
  const { subjectId, semesterId } = useParams();
  const subjectName = subjectId?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "";
  const [contentSections, setContentSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingAll, setDownloadingAll] = useState(false);


  useEffect(() => {
    const fetchContentBySubject = async () => {
      try {
        const res = await fetch(CONTENTS.GET_BY_SUBJECTS(subjectId));
        const data = await res.json();

        // Transform backend data to frontend-friendly format
        const iconMap = {
          Notes: <BookOpen className="w-5 h-5 text-blue-600" />,
          Videos: <University className="w-5 h-5 text-red-600" />,
          Syllabus: <List className="w-5 h-5 text-green-600" />,
          Extras: <Download className="w-5 h-5 text-purple-600" />
        };

        const transformed = data.map((section) => ({
          title: section.title,
          description: section.description,
          icon: iconMap[section.type] || <BookOpen className="w-5 h-5 text-gray-500" />,
          items: section.items.map((item) => ({
            name: item.name,
            type: item.type.includes("pdf") ? "PDF" : item.type.split("/")[1].toUpperCase(),
            size: item.size,
            url: item.cloudinaryUrl
          }))
        }));

        setContentSections(transformed);
      } catch (error) {
        console.error("Failed to load content:", error);
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) fetchContentBySubject();
  }, [subjectId]);

  const handleBulkDownload = async () => {
    setDownloadingAll(true);
    try {
      const response = await fetch(CONTENTS.DOWNLOAD_BY_SUBJECTS(subjectId));

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${subjectName}-materials.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download materials.");
    } finally {
      setDownloadingAll(false);
    }
  }

  const contentCounts = useMemo(() => {
    const counts = {
      Notes: 0,
      Videos: 0,
      Assignments: 0,
      Labs: 0
    };

    contentSections.forEach((section) => {
      const title = section.title.toLowerCase();

      section.items.forEach(() => {
        if (title.includes("note") || title.includes("pdf")) {
          counts.Notes += 1;
        } else if (title.includes("video")) {
          counts.Videos += 1;
        } else if (title.includes("assignment")) {
          counts.Assignments += 1;
        } else if (title.includes("lab")) {
          counts.Labs += 1;
        }
      });
    });

    return counts;
  }, [contentSections]);

  return (
    <PageLayout
      title={subjectName}
      description={`All study materials and resources for ${subjectName} - Semester ${semesterId}`}
    >
      <div className="space-y-8">
        {/* Subject Overview */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900">Subject Overview</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Complete learning materials organized by category
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-sm px-3 py-1">
                Semester {semesterId}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{contentCounts.Notes}
                  +</div>
                <div className="text-sm text-gray-600">Notes & PDFs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{contentCounts.Videos}
                </div>
                <div className="text-sm text-gray-600">Video Lectures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{contentCounts.Assignments}
                </div>
                <div className="text-sm text-gray-600">Assignments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{contentCounts.Labs}
                </div>
                <div className="text-sm text-gray-600">Lab Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contentSections.map((section, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {section.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">{item.type}</Badge>
                            <span>{item.size}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-3"
                          onClick={async () => {
                            try {
                              const res = await fetch(item.url);
                              const blob = await res.blob();
                              const blobUrl = URL.createObjectURL(blob);

                              const a = document.createElement("a");
                              a.href = blobUrl;
                              a.download = item.name;
                              a.click();
                              URL.revokeObjectURL(blobUrl);
                            } catch (err) {
                              alert("Download failed");
                            }
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      {itemIndex < section.items.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bulk Download */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Download All Materials</h3>
                <p className="text-gray-600 mt-1">Get all study materials for {subjectName} in one ZIP file</p>
              </div>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleBulkDownload}
                disabled={downloadingAll}
              >
                {downloadingAll ? (
                  <span className="flex items-center">
                    <svg className="animate-spin w-4 h-4 mr-2 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Preparing...
                  </span>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download All
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Content;
