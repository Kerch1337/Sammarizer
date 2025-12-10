export default async function HistoryItem({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return <div className="min-h-[85vh] flex flex-col items-center justify-center gap-4">
        History Item {id}
    </div>
}