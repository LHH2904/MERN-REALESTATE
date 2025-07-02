import {Card,Button, FileInput, HelperText, Label, TextInput, Textarea, Checkbox} from "flowbite-react";
import {type ChangeEvent, useState, useEffect} from "react";
import { supabase } from "../supabase";

const CreateListing = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>("");
    const [formData, setFormData] = useState({
        imageUrls: [] as string[],
    });
    console.log(formData)

    // ✅ Lưu file đã chọn
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;

        const filesArray = Array.from(selectedFiles);

        for (const file of filesArray) {
            if (file.size > 2 * 1024 * 1024) {
                setError("Kích thước mỗi file phải nhỏ hơn 2MB.");
                return;
            }
        }

        const remainingSlots = 6 - formData.imageUrls.length;

        if (remainingSlots <= 0) {
            setError(`Bạn chỉ có thể tải lên tối đa 6 ảnh. Hiện đã có ${formData.imageUrls.length} ảnh.`);
            setFiles([]);
            return;
        }

        const filesToKeep = filesArray.slice(0, remainingSlots);

        if (filesArray.length > remainingSlots) {
            setError(`Chỉ có thể chọn thêm ${remainingSlots} ảnh nữa.`);
        } else {
            setError("");
        }

        setFiles(filesToKeep);
    };

    useEffect(() => {
        if (formData.imageUrls.length <= 6 && error.includes("tối đa 6 ảnh")) {
            setError("");
        }
    }, [formData.imageUrls]);

    // ✅ Upload lên Supabase và lấy public URL
    const handleImageSubmit = async () => {
        if (files.length === 0) {
            setError("Bạn chưa chọn ảnh");
            return;
        }

        const availableSlots = 6 - formData.imageUrls.length;
        if (availableSlots <= 0) {
            setError("Bạn đã tải lên đủ 6 ảnh.");
            return;
        }

        try {
            const uploadPromises = files.map(async (file) => {
                const fileName = `${Date.now()}-${file.name}`;
                const filePath = `listing-images/${fileName}`;

                const { error } = await supabase.storage
                    .from("listing-images")
                    .upload(filePath, file, {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: file.type,
                    });

                if (error) throw error;

                // ✅ Lấy URL công khai
                const { data: publicUrlData } = supabase.storage
                    .from("listing-images")
                    .getPublicUrl(filePath);

                return publicUrlData.publicUrl;
            });

            const urls = await Promise.all(uploadPromises);

            setFormData((prev) => ({
                ...prev,
                imageUrls: [...prev.imageUrls, ...urls],
            }));

            setFiles([]);
            setError("");
            alert("Upload ảnh thành công!");
        } catch (error) {
            console.error("Lỗi upload:", error);
            setError("Có lỗi xảy ra khi upload ảnh.");
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove),
        }));
    };

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form action="" className='flex flex-col gap-4 sm:flex-row'>
                <div className='flex flex-col gap-4 flex-1 max-w-md'>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email2">Name</Label>
                        </div>
                        <TextInput
                            id="name"
                            type="text"
                            placeholder="name@flowbite.com"
                            sizing="md"
                            maxLength={62}
                            minLength={10}
                            required
                            shadow
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="description">description</Label>
                        </div>
                        <Textarea id="description" placeholder="Leave a comment..." required rows={4}/>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="address">Address</Label>
                        </div>
                        <TextInput id="address" type="text" required shadow/>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className="flex items-center gap-2">
                            <Checkbox id="sell"/>
                            <Label htmlFor="sell" className="flex">
                                Sell
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="rent"/>
                            <Label htmlFor="rent" className="flex">
                                Rent
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="parking"/>
                            <Label htmlFor="parking" className="flex">
                                Parking spot
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="furnish"/>
                            <Label htmlFor="furnish" className="flex">
                                Furnished
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="offer"/>
                            <Label htmlFor="offer" className="flex">
                                Offer
                            </Label>
                        </div>
                    </div>
                    <div className='flex gap-4 flex-wrap'>
                        <div className='flex items-center gap-2'>
                            <TextInput
                                id="bedrooms"
                                type="number"
                                sizing="md"
                                min={1}
                                max={10}
                                required
                                shadow
                            />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <TextInput
                                id="bathrooms"
                                type="number"
                                sizing="md"
                                min={1}
                                max={10}
                                required
                                shadow
                            />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <TextInput
                                id="regularPrice"
                                type="number"
                                sizing="md"
                                required
                                shadow
                            />
                            <div className='flex flex-col items-center'>
                                <p className='text-md'>Regular Price</p>
                                <span className='text-sm'>($/month)</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <TextInput
                                id="discountPrice"
                                type="number"
                                sizing="md"
                                required
                                shadow
                            />
                            <div className='flex flex-col items-center'>
                                <p className='text-md'>Discount Price</p>
                                <span className='text-sm'>($/month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4 max-w-md mt-1'>
                    <div id="fileUpload" >
                        <Label className="mb-2 block" htmlFor="file">
                            Images:{" "}
                            <span className="text-xs text-gray-500">(the first image will be the cover)</span>
                        </Label>
                        <div className='flex gap-2'>
                            <FileInput id="file" accept='image/*'  multiple onChange={handleFileChange}/>
                            <Button type="button" onClick={handleImageSubmit} disabled={!!error}>
                                UPLOAD
                            </Button>
                        </div>
                        <HelperText className="mt-1">A profile picture is useful to confirm your are logged into your
                            account</HelperText>
                        {error && (
                            <HelperText className="text-red-600 font-medium text-center">
                                {error}
                            </HelperText>
                        )}
                    </div>
                    {formData.imageUrls.length > 0 && (
                        <div className="flex flex-col gap-4 mt-4">
                            {formData.imageUrls.map((url, index) => (
                                <Card
                                    key={index}
                                    horizontal
                                    imgSrc={url}
                                    className="max-w-md w-full [&>img]:!h-40 [&>img]:!w-50 [&>img]:object-cover"
                                >
                                    <div className="flex items-center gap-8 justify-around">
                                        <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                                            Ảnh #{index + 1}
                                        </h5>
                                        <Button type="button" onClick={() => handleRemoveImage(index)} color="red">
                                            DELETE
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    <Button type="submit">
                        CREATE LISTING
                    </Button>
                </div>
            </form>
        </main>
    );
};

export default CreateListing;