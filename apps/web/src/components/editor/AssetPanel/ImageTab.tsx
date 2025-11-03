'use client'

interface ImageTabProps {
  onImageUpload: (file: File) => void
}

export function ImageTab({ onImageUpload }: ImageTabProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageUpload(file)
    }
  }

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center cursor-pointer"
      >
        上传图片
      </label>
    </div>
  )
}
