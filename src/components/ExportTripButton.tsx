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
    // For now, just trigger print dialog
    window.print();
    toast({
      title: "Print dialog opened",
      description: "Save as PDF from print options",
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