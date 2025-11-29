import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, Calendar, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportTripButtonProps {
  location: string;
  date: string;
  itinerary: any[];
}

export const ExportTripButton = ({ location, date, itinerary }: ExportTripButtonProps) => {
  const { toast } = useToast();

  const exportAsText = () => {
    const text = `${location} - ${date}\n\n` +
      itinerary.map(item => 
        `${item.time} - ${item.title}\n${item.description}\n\n`
      ).join('');

    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Itinerary text copied",
    });
  };

  const exportAsCalendar = () => {
    // Create ICS file content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//GaggleGO//EN',
      ...itinerary.map(item => [
        'BEGIN:VEVENT',
        `SUMMARY:${item.title}`,
        `DESCRIPTION:${item.description}`,
        `DTSTART:${new Date().toISOString().split('T')[0].replace(/-/g, '')}T${item.time.replace(/[: ]/g, '')}00`,
        'DURATION:PT1H',
        'END:VEVENT'
      ].join('\n')),
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${location.replace(/\s+/g, '-')}.ics`;
    a.click();

    toast({
      title: "Calendar exported!",
      description: "Add to your calendar app",
    });
  };

  const exportAsPDF = () => {
    // Create print-friendly content
    const printContent = `
      <html>
        <head>
          <title>${location} Itinerary</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2d3748; margin-bottom: 10px; }
            .date { color: #718096; margin-bottom: 30px; }
            .item { margin-bottom: 25px; page-break-inside: avoid; }
            .time { font-weight: bold; color: #f97316; }
            .title { font-size: 18px; font-weight: bold; margin: 5px 0; }
            .description { color: #4a5568; line-height: 1.6; }
            .type { display: inline-block; padding: 4px 8px; background: #e2e8f0; border-radius: 4px; font-size: 12px; margin-top: 5px; }
          </style>
        </head>
        <body>
          <h1>${location} Itinerary</h1>
          <div class="date">${date}</div>
          ${itinerary.map(item => `
            <div class="item">
              <div class="time">${item.time}</div>
              <div class="title">${item.title}</div>
              <div class="description">${item.description}</div>
              <span class="type">${item.type}</span>
            </div>
          `).join('')}
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
    
    toast({
      title: "PDF ready",
      description: "Save as PDF from print dialog",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsText}>
          <Copy className="w-4 h-4 mr-2" />
          Copy as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsCalendar}>
          <Calendar className="w-4 h-4 mr-2" />
          Export to Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsPDF}>
          <FileText className="w-4 h-4 mr-2" />
          Save as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};