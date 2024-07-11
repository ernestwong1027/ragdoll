"use client"

import {useState, DragEvent, ChangeEvent, FormEvent} from "react"
import {Button} from "@/components/ui/button"
import {uploadFiles} from "@/app/upload/actions";

export default function Upload() {
    const [files, setFiles] = useState<File[]>([])

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setFiles([...files, ...Array.from(e.dataTransfer.files)])
    }

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)])
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`file${index}`, file);
        });
        await uploadFiles(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div
                className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-6 py-12 px-4 sm:px-6 lg:px-8">
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold">Upload Documents</h2>
                    <p className="text-muted-foreground">Drag and drop files or select them from your device.</p>
                </div>
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-primary rounded-lg bg-muted transition-colors hover:bg-muted/80 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                >
                    <CloudUploadIcon className="w-12 h-12 "/>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Drag and drop files here or{" "}
                        <label htmlFor="file-input" className="font-medium text-primary cursor-pointer hover:underline">
                            select from your device
                        </label>
                    </p>
                    <input id="file-input" name="file-input" type="file" multiple className="sr-only" onChange={handleFileSelect}/>
                </div>
                {files.length > 0 && (
                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Uploaded Files</h3>
                            <Button
                                variant="outline"
                                onClick={() => setFiles([])}
                                className="text-muted-foreground"
                            >
                                Clear All
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {files.map((file, index) => (
                                <div key={index}
                                     className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
                                    <div className="flex items-center gap-4">
                                        <FileIcon className="w-6 h-6"/>
                                        <div>
                                            <p className="font-medium ">{file.name}</p>
                                            <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className=""
                                            onClick={() => setFiles(files.toSpliced(index, 1))}>
                                        <XIcon className="w-5 h-5"/>
                                        <span className="sr-only">Remove file</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </div>
        </form>

    )
}

function CloudUploadIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
            <path d="M12 12v9"/>
            <path d="m16 16-4-4-4 4"/>
        </svg>
    )
}


function FileIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
        </svg>
    )
}


function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
        </svg>
    )
}