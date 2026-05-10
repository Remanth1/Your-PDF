import mammoth from "mammoth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function wordToPdf(
  file: File,
  onProgress: (p: number) => void,
): Promise<Blob> {
  onProgress(15);
  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
  onProgress(40);

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.width = "794px"; // ~A4 @ 96dpi
  container.style.padding = "48px";
  container.style.background = "#fff";
  container.style.color = "#000";
  container.style.fontFamily = "Helvetica, Arial, sans-serif";
  container.style.fontSize = "14px";
  container.style.lineHeight = "1.5";
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2, backgroundColor: "#ffffff" });
    onProgress(75);

    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    let remaining = imgHeight;
    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    remaining -= pageHeight;

    while (remaining > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      remaining -= pageHeight;
    }
    onProgress(100);
    return pdf.output("blob");
  } finally {
    document.body.removeChild(container);
  }
}
