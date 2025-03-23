import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCapsule } from "@/queries/capsule";
import { MessageContent, ImageContent, VideoContent, Capsule } from "@/types";
import { format } from "date-fns";
import { Calendar, Lock, Unlock } from "lucide-react";
import Spinner from "@/components/ui/spinner";

export default function OpenedCapsule() {
    const params = useParams();

    const { data, isLoading, error } = useQuery({
        queryKey: ["getCapsule", params.id],
        queryFn: () => getCapsule(params.id as string),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <Spinner />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold text-red-500">Error</h1>
                <p>Failed to load the capsule. Please try again later.</p>
            </div>
        );
    }

    const capsule = data.data as Capsule;
    const isOpened = capsule.is_opened;

    const createdDate = new Date(capsule.created_at);
    const scheduledDate = new Date(capsule.scheduled_open_date);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {capsule.title}
                        </h1>
                        <p className="text-gray-600 mb-4">
                            {capsule.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isOpened ? (
                            <Unlock className="h-6 w-6 text-green-500" />
                        ) : (
                            <Lock className="h-6 w-6 text-red-500" />
                        )}
                        <span
                            className={
                                isOpened ? "text-green-500" : "text-red-500"
                            }
                        >
                            {isOpened ? "Opened" : "Locked"}
                        </span>
                    </div>
                </div>

                <div className="flex gap-6 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                            Created: {format(createdDate, "MMM d, yyyy")}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                            Scheduled to open:{" "}
                            {format(scheduledDate, "MMM d, yyyy 'at' h:mm a")}
                        </span>
                    </div>
                </div>
            </div>

            {isOpened ? (
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        Capsule Contents
                    </h2>
                    {capsule?.content_items ? (
                        <div className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none">
                            <div>
                                {capsule?.content_items.map((item, index) => (
                                    <div key={index} className="last:pb-0">
                                        {item.type === "message" && (
                                            <div className="my-4">
                                                <p className="text-gray-800 leading-relaxed">
                                                    {
                                                        (
                                                            item.content as MessageContent
                                                        ).text
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {item.type === "image" && (
                                            <figure className="my-6">
                                                <img
                                                    src={
                                                        (
                                                            item.content as ImageContent
                                                        ).url
                                                    }
                                                    alt={
                                                        (
                                                            item.content as ImageContent
                                                        ).alt_text ||
                                                        "Capsule image"
                                                    }
                                                    className="max-w-md mx-auto h-auto rounded-md"
                                                />
                                                {(item.content as ImageContent)
                                                    .caption && (
                                                    <figcaption className="text-sm text-gray-500 italic mt-2 text-center">
                                                        {
                                                            (
                                                                item.content as ImageContent
                                                            ).caption
                                                        }
                                                    </figcaption>
                                                )}
                                            </figure>
                                        )}

                                        {item.type === "video" && (
                                            <figure className="my-6">
                                                <video
                                                    src={
                                                        (
                                                            item.content as VideoContent
                                                        ).url
                                                    }
                                                    controls
                                                    className="max-w-md mx-auto h-auto rounded-md"
                                                />
                                                {(item.content as VideoContent)
                                                    .caption && (
                                                    <figcaption className="text-sm text-gray-500 italic mt-2 text-center">
                                                        {
                                                            (
                                                                item.content as VideoContent
                                                            ).caption
                                                        }
                                                    </figcaption>
                                                )}
                                            </figure>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <p className="text-gray-500 italic text-center">
                                Content available! However, we need to update
                                the API to include content_items for opened
                                capsules.
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Lock className="h-16 w-16 mx-auto text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">
                        This time capsule is locked
                    </h2>
                    <p className="text-gray-600 mb-4">
                        This capsule will be opened on{" "}
                        {format(scheduledDate, "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                    <div className="p-4 bg-gray-50 rounded-lg max-w-md mx-auto">
                        <p className="text-sm text-gray-500">
                            Time capsules can only be viewed once they reach
                            their scheduled opening date. Check back later!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
