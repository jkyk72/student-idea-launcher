import { jsPDF } from 'jspdf'
import CryptoJS from 'crypto-js'

export interface IdeaDocument {
  title: string
  description: string
  author: string
  timestamp: string
  brainstormSummary?: string
  outline?: any
}

export const generateIdeaPDF = (data: IdeaDocument): Blob => {
  const doc = new jsPDF()

  // Set font
  doc.setFont('helvetica')

  // Title
  doc.setFontSize(24)
  doc.text('Student Idea Launcher', 105, 20, { align: 'center' })
  doc.setFontSize(18)
  doc.text('Idea Documentation', 105, 30, { align: 'center' })

  // Separator
  doc.setLineWidth(0.5)
  doc.line(20, 35, 190, 35)

  // Content
  let y = 45

  // Title
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Title:', 20, y)
  doc.setFont('helvetica', 'normal')
  y += 7
  const titleLines = doc.splitTextToSize(data.title, 170)
  doc.text(titleLines, 20, y)
  y += titleLines.length * 7 + 5

  // Author
  doc.setFont('helvetica', 'bold')
  doc.text('Author:', 20, y)
  doc.setFont('helvetica', 'normal')
  y += 7
  doc.text(data.author, 20, y)
  y += 10

  // Timestamp
  doc.setFont('helvetica', 'bold')
  doc.text('Created:', 20, y)
  doc.setFont('helvetica', 'normal')
  y += 7
  doc.text(data.timestamp, 20, y)
  y += 10

  // Description
  doc.setFont('helvetica', 'bold')
  doc.text('Description:', 20, y)
  doc.setFont('helvetica', 'normal')
  y += 7
  const descLines = doc.splitTextToSize(data.description, 170)
  doc.text(descLines, 20, y)
  y += descLines.length * 7 + 10

  // Brainstorm Summary (if available)
  if (data.brainstormSummary) {
    if (y > 250) {
      doc.addPage()
      y = 20
    }
    doc.setFont('helvetica', 'bold')
    doc.text('Brainstorm Summary:', 20, y)
    doc.setFont('helvetica', 'normal')
    y += 7
    const summaryLines = doc.splitTextToSize(data.brainstormSummary, 170)
    doc.text(summaryLines, 20, y)
    y += summaryLines.length * 7 + 10
  }

  // Outline (if available)
  if (data.outline && data.outline.slides) {
    if (y > 200) {
      doc.addPage()
      y = 20
    }
    doc.setFont('helvetica', 'bold')
    doc.text('Presentation Outline:', 20, y)
    y += 10

    data.outline.slides.forEach((slide: any, index: number) => {
      if (y > 260) {
        doc.addPage()
        y = 20
      }
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text(`${index + 1}. ${slide.title}`, 25, y)
      y += 7

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      slide.points.forEach((point: string) => {
        if (y > 270) {
          doc.addPage()
          y = 20
        }
        const pointLines = doc.splitTextToSize(`• ${point}`, 160)
        doc.text(pointLines, 30, y)
        y += pointLines.length * 6
      })
      y += 5
    })
  }

  // Footer with timestamp
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.text(
      `Page ${i} of ${pageCount} | Generated: ${data.timestamp}`,
      105,
      285,
      { align: 'center' }
    )
  }

  // Return PDF as Blob
  return doc.output('blob')
}

export const calculateSHA256 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result) {
        const wordArray = CryptoJS.lib.WordArray.create(e.target.result as any)
        const hash = CryptoJS.SHA256(wordArray).toString()
        resolve(hash)
      } else {
        reject(new Error('Failed to read blob'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read blob'))
    }

    reader.readAsArrayBuffer(blob)
  })
}

export const downloadPDF = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
