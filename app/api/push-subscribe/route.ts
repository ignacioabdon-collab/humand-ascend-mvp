import { NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"

const SUBSCRIPTIONS_FILE = join(process.cwd(), "push-subscriptions.json")

async function getSubscriptions(): Promise<PushSubscriptionJSON[]> {
  try {
    const data = await readFile(SUBSCRIPTIONS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveSubscriptions(subs: PushSubscriptionJSON[]): Promise<void> {
  await writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(subs, null, 2))
}

export async function POST(request: Request) {
  try {
    const newSub: PushSubscriptionJSON = await request.json()

    if (!newSub.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription: missing endpoint" },
        { status: 400 }
      )
    }

    const subscriptions = await getSubscriptions()
    const exists = subscriptions.some((s) => s.endpoint === newSub.endpoint)

    if (!exists) {
      subscriptions.push(newSub)
      await saveSubscriptions(subscriptions)
    }

    return NextResponse.json({
      success: true,
      message: exists ? "Subscription already registered" : "Subscription saved",
      total: subscriptions.length,
    })
  } catch (error) {
    console.error("Push subscribe error:", error)
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const subscriptions = await getSubscriptions()
  return NextResponse.json({
    total: subscriptions.length,
    subscriptions,
  })
}
