import { NextResponse } from "next/server"
import webpush from "web-push"
import { readFile } from "fs/promises"
import { join } from "path"

webpush.setVapidDetails(
  "mailto:hello@humand.co",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

const SUBSCRIPTIONS_FILE = join(process.cwd(), "push-subscriptions.json")

async function getSubscriptions(): Promise<webpush.PushSubscription[]> {
  try {
    const data = await readFile(SUBSCRIPTIONS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

interface WebhookPayload {
  type: string
  question: string
  timestamp: string
  source: string
  automatic: boolean
}

export async function POST(request: Request) {
  try {
    const body: WebhookPayload = await request.json()

    if (!body.type || !body.question) {
      return NextResponse.json(
        { error: "Missing required fields: type and question are required" },
        { status: 400 }
      )
    }

    if (body.type !== "reflection_question") {
      return NextResponse.json(
        { error: `Unsupported webhook type: ${body.type}` },
        { status: 400 }
      )
    }

    const question = body.question
    console.log("Webhook received:", { type: body.type, question })

    const baseUrl = request.headers.get("host") || "localhost:3000"
    const protocol = request.headers.get("x-forwarded-proto") || "http"
    const redirectUrl = `${protocol}://${baseUrl}?question=${encodeURIComponent(question)}`

    const subscriptions = await getSubscriptions()
    const pushPayload = JSON.stringify({
      title: "Humand Ascend",
      body: "Tienes una nueva pregunta de reflexión",
      question,
      url: redirectUrl,
    })

    const results = await Promise.allSettled(
      subscriptions.map((sub) => webpush.sendNotification(sub, pushPayload))
    )

    const sent = results.filter((r) => r.status === "fulfilled").length
    const failed = results.filter((r) => r.status === "rejected").length
    console.log(`Push notifications: ${sent} sent, ${failed} failed`)

    return NextResponse.json({
      success: true,
      message: "Webhook processed and push notifications sent",
      data: {
        question,
        redirectUrl,
        pushNotifications: { total: subscriptions.length, sent, failed },
        receivedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Failed to process webhook payload" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Webhook endpoint is active",
    supportedTypes: ["reflection_question"],
  })
}
