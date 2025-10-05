"use client"

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react"

export default function Summarize() {

    const [url,setUrl] = useState("")

    return <div className="min-h-[85vh] flex flex-col items-center justify-center gap-4">
    <Input
        value = {url}
            onChange={(ev)=>{
                setUrl(ev.target.value)
            }}
        placeholder="Enter URL"
        className="w-130"
    />
    <Button className="w-40 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors">
        Summarize
    </Button>
    </div>
}