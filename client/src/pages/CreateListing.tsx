import {Button, FileInput, HelperText, Label, TextInput, Textarea, Checkbox} from "flowbite-react";

const CreateListing = () => {
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
                            <FileInput id="file" accept='image/*'/>
                            <Button type="submit">
                                UPLOAD
                            </Button>
                        </div>
                        <HelperText className="mt-1">A profile picture is useful to confirm your are logged into your
                            account</HelperText>
                    </div>
                    <Button type="submit">
                        CREATE LISTING
                    </Button>
                </div>
            </form>
        </main>
    );
};

export default CreateListing;