import { Heading } from "@radix-ui/themes";

export default function Error() {
    return (
        <div>
            <div className="w-[60%] m-auto mb-8">
                <Heading size="6" mb="2" align="center">
                    Error
                </Heading>
                <div className="text-center">
                    <p>Something went wrong</p>
                    <p className="text-neutral-600">Back to <a href="/" className="text-blue-600 hover:underline">Home</a></p>
                </div>
            </div>
        </div>
    )
}
