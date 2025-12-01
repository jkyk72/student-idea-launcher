import { google } from 'googleapis'

export interface SlideOutline {
  slides: Array<{
    title: string
    points: string[]
  }>
}

export const createGoogleSlidesPresentation = async (
  accessToken: string,
  title: string,
  outline: SlideOutline
) => {
  try {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    auth.setCredentials({ access_token: accessToken })

    const slides = google.slides({ version: 'v1', auth })
    const drive = google.drive({ version: 'v3', auth })

    // Create a new presentation
    const presentation = await slides.presentations.create({
      requestBody: {
        title: title,
      },
    })

    const presentationId = presentation.data.presentationId!

    // Build requests for adding slides
    const requests: any[] = []

    outline.slides.forEach((slide, index) => {
      // Create a new slide
      const slideId = `slide_${index}`
      requests.push({
        createSlide: {
          objectId: slideId,
          insertionIndex: index,
          slideLayoutReference: {
            predefinedLayout: 'TITLE_AND_BODY',
          },
        },
      })

      // Add title
      requests.push({
        insertText: {
          objectId: `${slideId}_title`,
          text: slide.title,
        },
      })

      // Add body points
      const bodyText = slide.points.map((point, i) => `• ${point}`).join('\n')
      requests.push({
        insertText: {
          objectId: `${slideId}_body`,
          text: bodyText,
        },
      })
    })

    // Execute batch update
    if (requests.length > 0) {
      await slides.presentations.batchUpdate({
        presentationId,
        requestBody: {
          requests,
        },
      })
    }

    // Get presentation URL
    const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`

    return {
      presentationId,
      presentationUrl,
    }
  } catch (error) {
    console.error('Google Slides API Error:', error)
    throw new Error('スライド生成でエラーが発生しました')
  }
}

// Simplified version without OAuth (for MVP demo)
export const createSlidesFromOutline = async (
  title: string,
  outline: SlideOutline
) => {
  // For MVP, we'll return a mock response
  // In production, implement full OAuth flow

  const mockPresentationId = `mock_${Date.now()}`
  const mockUrl = `https://docs.google.com/presentation/d/${mockPresentationId}/edit`

  // In a real implementation, you would:
  // 1. Get OAuth token from user
  // 2. Use googleapis to create presentation
  // 3. Return actual presentation ID and URL

  return {
    presentationId: mockPresentationId,
    presentationUrl: mockUrl,
    slides: outline.slides,
    note: 'MVP版: 実際のGoogle Slidesとの連携は認証設定後に有効化されます'
  }
}
