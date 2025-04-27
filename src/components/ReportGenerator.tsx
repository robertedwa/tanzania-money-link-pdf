
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { getAllContributions, Contribution } from '@/lib/data';
import { Download, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface ReportGeneratorProps {
  onGenerateReport?: (reportBlob: Blob) => void;
}

export const ReportGenerator = ({ onGenerateReport }: ReportGeneratorProps) => {
  const [reportType, setReportType] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const reportLinkRef = useRef<HTMLAnchorElement>(null);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Get all contributions
    const contributions = getAllContributions();
    
    if (contributions.length === 0) {
      toast({
        title: "Error",
        description: "No contributions to generate a report",
        variant: "destructive",
      });
      setIsGenerating(false);
      return;
    }
    
    try {
      // Filter contributions based on reportType if needed
      let filteredContributions = contributions;
      
      if (reportType === 'completed') {
        filteredContributions = contributions.filter(c => c.paymentStatus === 'completed');
      } else if (reportType === 'pending') {
        filteredContributions = contributions.filter(c => c.paymentStatus === 'pending');
      }
      
      // Generate PDF
      const reportBlob = await generatePDFReport(filteredContributions);
      
      // Create a download link
      const url = URL.createObjectURL(reportBlob);
      
      if (reportLinkRef.current) {
        reportLinkRef.current.href = url;
        reportLinkRef.current.download = `tanzapay-report-${new Date().toISOString().slice(0, 10)}.pdf`;
        reportLinkRef.current.click();
      }
      
      if (onGenerateReport) {
        onGenerateReport(reportBlob);
      }
      
      toast({
        title: "Success",
        description: "Report generated successfully",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generatePDFReport = (contributions: Contribution[]): Promise<Blob> => {
    return new Promise((resolve) => {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('TanzaPay Community Contribution Report', 14, 22);
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy')}`, 14, 32);
      
      // Add summary
      const total = contributions.reduce((sum, c) => sum + c.amount, 0);
      doc.text(`Total Contributions: ${contributions.length}`, 14, 42);
      doc.text(`Total Amount: ${total.toLocaleString()} TZS`, 14, 48);
      
      // Add table
      autoTable(doc, {
        startY: 60,
        head: [['Date', 'Title', 'Method', 'Status', 'Amount (TZS)']],
        body: contributions.map(c => [
          format(new Date(c.date), 'yyyy-MM-dd'),
          c.title,
          getProviderName(c.paymentMethod),
          c.paymentStatus,
          c.amount.toLocaleString(),
        ]),
        theme: 'striped',
        headStyles: { fillColor: [0, 166, 81] }, // Green color
      });
      
      // Convert to blob
      const blob = doc.output('blob');
      resolve(blob);
    });
  };
  
  const getProviderName = (providerId: string) => {
    const providers: Record<string, string> = {
      'mpesa': 'M-Pesa',
      'tigopesa': 'Tigo Pesa',
      'airtelmoney': 'Airtel Money',
      'halopesa': 'Halopesa',
    };
    
    return providers[providerId] || providerId;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Generate Report</h2>
          <FileText className="text-primary" />
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reportType">Report Type</Label>
            <Select
              value={reportType}
              onValueChange={setReportType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contributions</SelectItem>
                <SelectItem value="completed">Completed Only</SelectItem>
                <SelectItem value="pending">Pending Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Generate PDF Report"}
            {!isGenerating && <Download className="ml-2 h-4 w-4" />}
          </Button>
          
          {/* Hidden download link */}
          <a ref={reportLinkRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};
