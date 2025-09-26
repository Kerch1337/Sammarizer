export async function GET(request: Request) {
    return Response.json({ data: "Some data" })
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ data: "Post", body })
}

export async function PUT(request: Request) {
  const body = await request.json()
  return Response.json({ data: "Put", body })
}

export async function DELETE(request: Request) {
  return Response.json({ data: "Delete" })
}