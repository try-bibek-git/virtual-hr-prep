
import jsPDF from 'jspdf';

interface ReportData {
  profile: {
    name: string;
    jobRole: string;
    experienceLevel: string;
    interviewType?: string;
  };
  evaluation: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    feedback: string;
    source?: string;
  };
  questions: string[];
  answers: string[];
}

export const generatePDFReport = (data: ReportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 30;

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 12) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.5);
  };

  // Helper function to check if we need a new page
  const checkNewPage = (currentY: number, requiredSpace = 30) => {
    if (currentY + requiredSpace > doc.internal.pageSize.height - margin) {
      doc.addPage();
      return 30;
    }
    return currentY;
  };

  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Interview Performance Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString();
  doc.text(`Generated on: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Candidate Information
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Candidate Information', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${data.profile.name}`, margin, yPosition);
  yPosition += 8;
  doc.text(`Job Role: ${data.profile.jobRole.replace('_', ' ').toUpperCase()}`, margin, yPosition);
  yPosition += 8;
  doc.text(`Experience Level: ${data.profile.experienceLevel.replace('_', ' ').toUpperCase()}`, margin, yPosition);
  yPosition += 8;
  if (data.profile.interviewType) {
    doc.text(`Interview Type: ${data.profile.interviewType}`, margin, yPosition);
    yPosition += 8;
  }
  yPosition += 10;

  // Overall Score
  yPosition = checkNewPage(yPosition, 40);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Overall Performance', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(36);
  doc.setTextColor(data.evaluation.score >= 75 ? 0 : data.evaluation.score >= 60 ? 255 : 220, data.evaluation.score >= 75 ? 150 : data.evaluation.score >= 60 ? 140 : 20, data.evaluation.score >= 75 ? 0 : data.evaluation.score >= 60 ? 0 : 60);
  doc.text(`${data.evaluation.score}%`, pageWidth / 2, yPosition, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPosition += 25;

  // Feedback
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  yPosition = addWrappedText(data.evaluation.feedback, margin, yPosition, pageWidth - 2 * margin);
  yPosition += 15;

  // Strengths
  yPosition = checkNewPage(yPosition, 60);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Strengths', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  data.evaluation.strengths.forEach((strength, index) => {
    yPosition = checkNewPage(yPosition, 15);
    yPosition = addWrappedText(`• ${strength}`, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 5;
  });
  yPosition += 10;

  // Areas for Improvement
  yPosition = checkNewPage(yPosition, 60);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Areas for Improvement', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  data.evaluation.weaknesses.forEach((weakness, index) => {
    yPosition = checkNewPage(yPosition, 15);
    yPosition = addWrappedText(`• ${weakness}`, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 5;
  });
  yPosition += 10;

  // Suggestions
  yPosition = checkNewPage(yPosition, 60);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommendations', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  data.evaluation.suggestions.forEach((suggestion, index) => {
    yPosition = checkNewPage(yPosition, 20);
    yPosition = addWrappedText(`${index + 1}. ${suggestion}`, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 8;
  });

  // Interview Q&A
  doc.addPage();
  yPosition = 30;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Interview Questions & Answers', margin, yPosition);
  yPosition += 20;

  data.questions.forEach((question, index) => {
    yPosition = checkNewPage(yPosition, 40);
    
    // Question
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText(`Q${index + 1}: ${question}`, margin, yPosition, pageWidth - 2 * margin, 14);
    yPosition += 10;

    // Answer
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const answer = data.answers[index] || 'No answer provided';
    yPosition = addWrappedText(`Answer: ${answer}`, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 15;
  });

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    if (data.evaluation.source) {
      doc.text(`Evaluated using ${data.evaluation.source}`, margin, doc.internal.pageSize.height - 10);
    }
  }

  // Save the PDF
  const fileName = `Interview_Report_${data.profile.name.replace(/\s+/g, '_')}_${currentDate.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
