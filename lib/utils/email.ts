import nodemailer from 'nodemailer'

export interface ExpertEmailData {
  expertType: 'tax_accountant' | 'lawyer' | 'patent_attorney'
  studentName: string
  studentEmail: string
  ideaTitle: string
  message: string
}

const expertEmails = {
  tax_accountant: 'tax-expert@example.com',
  lawyer: 'lawyer@example.com',
  patent_attorney: 'patent-attorney@example.com'
}

const expertNames = {
  tax_accountant: '税理士',
  lawyer: '弁護士',
  patent_attorney: '弁理士'
}

export const sendExpertEmail = async (data: ExpertEmailData): Promise<boolean> => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const expertEmail = expertEmails[data.expertType]
    const expertName = expertNames[data.expertType]

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: expertEmail,
      subject: `[Student Idea Launcher] 学生からの相談: ${data.ideaTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">新しい相談が届きました</h2>

          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1F2937; margin-top: 0;">相談者情報</h3>
            <p><strong>名前:</strong> ${data.studentName}</p>
            <p><strong>メール:</strong> ${data.studentEmail}</p>
          </div>

          <div style="background-color: #EFF6FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1F2937; margin-top: 0;">アイデア情報</h3>
            <p><strong>タイトル:</strong> ${data.ideaTitle}</p>
          </div>

          <div style="background-color: #FFFFFF; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1F2937; margin-top: 0;">相談内容</h3>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 14px;">
              このメールは Student Idea Launcher から送信されています。
              <br>
              学生への返信は上記のメールアドレスへお願いします。
            </p>
          </div>
        </div>
      `,
      text: `
新しい相談が届きました

相談者情報:
名前: ${data.studentName}
メール: ${data.studentEmail}

アイデア情報:
タイトル: ${data.ideaTitle}

相談内容:
${data.message}

---
このメールは Student Idea Launcher から送信されています。
学生への返信は上記のメールアドレスへお願いします。
      `
    }

    // For MVP demo, we'll just log the email instead of actually sending it
    console.log('=== DEMO: Email would be sent ===')
    console.log('To:', expertEmail)
    console.log('Subject:', mailOptions.subject)
    console.log('Content:', mailOptions.text)
    console.log('================================')

    // Uncomment the following line for production
    // await transporter.sendMail(mailOptions)

    return true
  } catch (error) {
    console.error('Email sending error:', error)
    throw new Error('メール送信に失敗しました')
  }
}

export const sendConfirmationEmail = async (
  studentEmail: string,
  studentName: string,
  expertType: string,
  ideaTitle: string
): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const expertName = expertNames[expertType as keyof typeof expertNames]

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: studentEmail,
      subject: '[Student Idea Launcher] 専門家への相談を受け付けました',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">相談を受け付けました</h2>

          <p>${studentName} 様</p>

          <p>「${ideaTitle}」に関する${expertName}への相談を受け付けました。</p>

          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;">
              専門家から3営業日以内に返信があります。
              <br>
              しばらくお待ちください。
            </p>
          </div>

          <p>引き続き Student Idea Launcher をご利用ください。</p>
        </div>
      `
    }

    // For MVP demo
    console.log('=== DEMO: Confirmation email would be sent ===')
    console.log('To:', studentEmail)
    console.log('Subject:', mailOptions.subject)
    console.log('===========================================')

    // Uncomment for production
    // await transporter.sendMail(mailOptions)

    return true
  } catch (error) {
    console.error('Confirmation email error:', error)
    return false
  }
}
