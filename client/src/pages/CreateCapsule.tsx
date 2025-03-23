import { Heading } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { ContentType, CreateCapsuleType, MessageContent } from "../types";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createCapsule, getPresignedUrl } from "../queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    CalendarIcon,
    X,
    MessageSquare,
    Image,
    Video,
    PlusCircle,
    Clock,
    GiftIcon,
    Upload,
    Star,
    Users,
} from "lucide-react";
import { format } from "date-fns";
import { ContentItem, ImageContent, VideoContent } from "@/types";
import { toast } from "sonner";
import { CREATE_CAPSULE } from "@/constants";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateCapsule() {
    const navigate = useNavigate();

    const [newCapsule, setNewCapsule] = useState<CreateCapsuleType>({
        title: "",
        description: "",
        scheduled_open_date: new Date(),
        content_items: [] as ContentItem[],
        participant_emails: [],
    });

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [uploading, setUploading] = useState(false);
    const [currentTab, setCurrentTab] = useState<ContentType>("message");
    const [messageText, setMessageText] = useState("");
    const [caption, setCaption] = useState("");
    const [altText, setAltText] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [participantEmail, setParticipantEmail] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewCapsule((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateSelect = (date: Date | undefined) => {
        setDate(date);
        if (date) {
            setNewCapsule((prev) => ({
                ...prev,
                scheduled_open_date: date,
            }));
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleAddContent = async () => {
        let newItem: ContentItem;

        if (currentTab === "message") {
            if (!messageText.trim()) return;

            newItem = {
                type: "message" as ContentType,
                content: {
                    text: messageText,
                } as MessageContent,
            };

            setMessageText("");
        } else {
            if (!selectedFile) return;
            setUploading(true);
            try {
                const { data } = await getPresignedUrl({
                    content_type: currentTab,
                    file_name: selectedFile.name,
                });
                const uploadResponse = await fetch(data.presigned_url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": selectedFile.type,
                    },
                    body: selectedFile,
                });

                if (!uploadResponse.ok)
                    throw new Error("Failed to upload file");

                if (currentTab === "image") {
                    newItem = {
                        type: "image" as ContentType,
                        content: {
                            url: data.final_url,
                            caption: caption,
                            alt_text: altText,
                        } as ImageContent,
                    };
                } else {
                    newItem = {
                        type: "video" as ContentType,
                        content: {
                            url: data.final_url,
                            caption: caption,
                        } as VideoContent,
                    };
                }

                setSelectedFile(null);
                setCaption("");
                setAltText("");
            } catch (error) {
                toast.error("Error uploading file");
                setUploading(false);
                return;
            }

            setUploading(false);
        }

        setNewCapsule((prev) => ({
            ...prev,
            content_items: [...prev.content_items, newItem],
        }));
    };

    const removeContentItem = (index: number) => {
        setNewCapsule((prev) => ({
            ...prev,
            content_items: prev.content_items.filter((_, i) => i !== index),
        }));
    };

    const resetForm = () => {
        setNewCapsule({
            title: "",
            description: "",
            scheduled_open_date: new Date(),
            participant_emails: [],
            content_items: [],
        });
    };

    const { mutate: createCapsuleMutation } = useMutation({
        mutationKey: [CREATE_CAPSULE],
        mutationFn: () => createCapsule(newCapsule),
        onSuccess: () => {
            toast.success("Capsule created successfully");
            resetForm();
            navigate(`/home`);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error?.response?.data?.message ||
                    "Something went wrong while creating capsule"
            );
        },
    });

    const handleCreateCapsule = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createCapsuleMutation();
    };

    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email.trim() === "" || emailRegex.test(email);
    };

    const handleAddParticipant = () => {
        if (!participantEmail.trim() || !isEmailValid(participantEmail)) return;
        if (newCapsule.participant_emails.length >= 10) return;
        if (newCapsule.participant_emails.includes(participantEmail.trim()))
            return;

        setNewCapsule((prev) => ({
            ...prev,
            participant_emails: [
                ...prev.participant_emails,
                participantEmail.trim(),
            ],
        }));
        setParticipantEmail("");
    };

    const removeParticipant = (index: number) => {
        setNewCapsule((prev) => ({
            ...prev,
            participant_emails: prev.participant_emails.filter(
                (_, i) => i !== index
            ),
        }));
    };

    return (
        <div className="flex flex-col items-center justify-center my-10 w-[85%] max-w-3xl mx-auto bg-gradient-to-b from-slate-50 to-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
                <GiftIcon className="h-8 w-8 text-indigo-600" />
                <Heading
                    size="6"
                    align="center"
                    className="text-slate-800 font-bold"
                >
                    Create Your Time Capsule
                </Heading>
            </div>

            <p className="text-slate-500 text-center mb-8 max-w-lg">
                Capture memories, messages, and media to be revealed in the
                future. Fill in the details below to create your personal time
                capsule.
            </p>

            <Form.Root
                className="w-full space-y-8"
                onSubmit={handleCreateCapsule}
            >
                <Form.Field className="grid" name="title">
                    <div className="flex items-baseline justify-between mb-2">
                        <Form.Label className="text-[15px] font-semibold text-slate-700 flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            Title
                        </Form.Label>
                        <Form.Message
                            className="text-[13px] text-rose-500"
                            match="valueMissing"
                        >
                            Please enter a title
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <Input
                            type="text"
                            required
                            name="title"
                            value={newCapsule.title}
                            onChange={handleChange}
                            placeholder="Name your time capsule"
                            className="border-slate-200 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 px-4 py-3"
                        />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="grid" name="description">
                    <div className="flex items-baseline justify-between mb-2">
                        <Form.Label className="text-[15px] font-semibold text-slate-700">
                            Description
                        </Form.Label>
                        <Form.Message
                            className="text-[13px] text-rose-500"
                            match="valueMissing"
                        >
                            Please enter a description
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <Textarea
                            required
                            name="description"
                            value={newCapsule.description}
                            onChange={handleChange}
                            placeholder="What's this time capsule about? Why are you creating it?"
                            className="border-slate-200 rounded-lg min-h-24 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 px-4 py-3"
                        />
                    </Form.Control>
                </Form.Field>

                <div className="grid">
                    <Label className="text-[15px] font-semibold text-slate-700 flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-indigo-500" />
                        Opening Date
                    </Label>
                    <Popover>
                        <PopoverTrigger>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start text-left font-normal mt-2 bg-white border-slate-200 hover:bg-slate-50 rounded-lg py-6"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                                {date ? (
                                    <span className="text-slate-700">
                                        {format(date, "PPP")}
                                    </span>
                                ) : (
                                    <span className="text-slate-400">
                                        Select when to open your capsule
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto p-0 rounded-xl border border-slate-200 shadow-lg"
                            align="start"
                            sideOffset={4}
                        >
                            <div className="z-50 p-3 bg-white rounded-xl">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateSelect}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                    className="rounded-lg"
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-[15px] font-semibold text-slate-700 flex items-center gap-2">
                            <Users className="h-4 w-4 text-violet-500" />
                            Participants
                        </Label>
                        <span className="text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                            {newCapsule.participant_emails.length}/10
                            participants
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            type="email"
                            id="participantEmail"
                            placeholder="Enter email address"
                            className="border-slate-200 rounded-lg"
                            value={participantEmail}
                            onChange={(e) =>
                                setParticipantEmail(e.target.value)
                            }
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="shrink-0 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
                            onClick={handleAddParticipant}
                            disabled={
                                !participantEmail.trim() ||
                                !isEmailValid(participantEmail) ||
                                newCapsule.participant_emails.length >= 10 ||
                                newCapsule.participant_emails.includes(
                                    participantEmail.trim()
                                )
                            }
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                    </div>

                    {!isEmailValid(participantEmail) &&
                        participantEmail.trim() !== "" && (
                            <p className="text-sm text-rose-500 mt-1">
                                Please enter a valid email address
                            </p>
                        )}

                    {newCapsule.participant_emails.length > 0 && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
                            <div className="text-sm text-slate-500 mb-2 font-medium">
                                Participants:
                            </div>
                            <div className="space-y-2">
                                {newCapsule.participant_emails.map(
                                    (email, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-white p-2 rounded-md border border-slate-200"
                                        >
                                            <span className="text-sm text-slate-700 truncate">
                                                {email}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeParticipant(index)
                                                }
                                                className="h-6 w-6 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-[15px] font-semibold text-slate-700 flex items-center gap-2">
                            <PlusCircle className="h-4 w-4 text-emerald-500" />
                            Content Items
                        </Label>
                        <span className="text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                            {newCapsule.content_items.length}/10 items
                        </span>
                    </div>

                    {newCapsule.content_items.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {newCapsule.content_items.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-slate-200 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div
                                                className={`p-2 rounded-full mr-3 ${
                                                    item.type === "message"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : item.type === "image"
                                                        ? "bg-emerald-100 text-emerald-600"
                                                        : "bg-amber-100 text-amber-600"
                                                }`}
                                            >
                                                {item.type === "message" && (
                                                    <MessageSquare className="h-4 w-4" />
                                                )}
                                                {item.type === "image" && (
                                                    <Image className="h-4 w-4" />
                                                )}
                                                {item.type === "video" && (
                                                    <Video className="h-4 w-4" />
                                                )}
                                            </div>
                                            <span className="truncate max-w-xs text-slate-700 font-medium">
                                                {item.type === "message"
                                                    ? (
                                                          (
                                                              item.content as MessageContent
                                                          ).text || ""
                                                      ).substring(0, 30) +
                                                      ((
                                                          item.content as MessageContent
                                                      ).text &&
                                                      (
                                                          item.content as MessageContent
                                                      ).text.length > 30
                                                          ? "..."
                                                          : "")
                                                    : item.type === "image"
                                                    ? (
                                                          item.content as ImageContent
                                                      ).caption || "Untitled"
                                                    : (
                                                          item.content as VideoContent
                                                      ).caption || "Untitled"}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeContentItem(index)
                                            }
                                            className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {item.type === "image" && (
                                        <img
                                            src={
                                                (item.content as ImageContent)
                                                    .url
                                            }
                                            alt={
                                                (item.content as ImageContent)
                                                    .alt_text || "Image preview"
                                            }
                                            className="mt-2 max-h-48 w-auto object-cover rounded"
                                        />
                                    )}
                                    {item.type === "video" && (
                                        <video
                                            controls
                                            className="mt-2 max-h-48 w-auto rounded"
                                        >
                                            <source
                                                src={
                                                    (
                                                        item.content as VideoContent
                                                    ).url
                                                }
                                                type="video/mp4"
                                            />
                                            Your browser does not support the
                                            video tag.
                                        </video>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <Card className="overflow-hidden border-slate-100 rounded-xl">
                        <CardContent className="p-6">
                            <Tabs
                                defaultValue="message"
                                value={currentTab}
                                onValueChange={(v) =>
                                    setCurrentTab(v as ContentType)
                                }
                            >
                                <TabsList className="grid w-full grid-cols-3 bg-slate-100 rounded-lg mb-6">
                                    <TabsTrigger value="message">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Message
                                    </TabsTrigger>
                                    <TabsTrigger value="image">
                                        <Image className="h-4 w-4 mr-2" />
                                        Image
                                    </TabsTrigger>
                                    <TabsTrigger value="video">
                                        <Video className="h-4 w-4 mr-2" />
                                        Video
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="message"
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="message"
                                            className="text-slate-700 font-medium"
                                        >
                                            Message Text
                                        </Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Write a message for the future..."
                                            value={messageText}
                                            onChange={(e) =>
                                                setMessageText(e.target.value)
                                            }
                                            className="border-slate-200 rounded-lg min-h-32"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    value="image"
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="image"
                                            className="text-slate-700 font-medium"
                                        >
                                            Upload Image
                                        </Label>
                                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-indigo-300 transition-colors">
                                            <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                                            <p className="text-sm text-slate-500 mb-2">
                                                Click to browse or drag and drop
                                            </p>
                                            <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() =>
                                                    document
                                                        .getElementById("image")
                                                        ?.click()
                                                }
                                            >
                                                Select Image
                                            </Button>
                                            {selectedFile &&
                                                currentTab === "image" && (
                                                    <p className="text-xs text-indigo-600 mt-2">
                                                        Selected:{" "}
                                                        {selectedFile.name}
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="caption"
                                            className="text-slate-700 font-medium"
                                        >
                                            Caption
                                        </Label>
                                        <Input
                                            id="caption"
                                            placeholder="Add a caption"
                                            value={caption}
                                            onChange={(e) =>
                                                setCaption(e.target.value)
                                            }
                                            className="border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="altText"
                                            className="text-slate-700 font-medium"
                                        >
                                            Alt Text
                                        </Label>
                                        <Input
                                            id="altText"
                                            placeholder="Describe this image"
                                            value={altText}
                                            onChange={(e) =>
                                                setAltText(e.target.value)
                                            }
                                            className="border-slate-200 rounded-lg"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    value="video"
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="video"
                                            className="text-slate-700 font-medium"
                                        >
                                            Upload Video
                                        </Label>
                                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-indigo-300 transition-colors">
                                            <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                                            <p className="text-sm text-slate-500 mb-2">
                                                Click to browse or drag and drop
                                            </p>
                                            <Input
                                                id="video"
                                                type="file"
                                                accept="video/*"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() =>
                                                    document
                                                        .getElementById("video")
                                                        ?.click()
                                                }
                                            >
                                                Select Video
                                            </Button>
                                            {selectedFile &&
                                                currentTab === "video" && (
                                                    <p className="text-xs text-indigo-600 mt-2">
                                                        Selected:{" "}
                                                        {selectedFile.name}
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="videoCaption"
                                            className="text-slate-700 font-medium"
                                        >
                                            Caption
                                        </Label>
                                        <Input
                                            id="videoCaption"
                                            placeholder="Add a caption"
                                            value={caption}
                                            onChange={(e) =>
                                                setCaption(e.target.value)
                                            }
                                            className="border-slate-200 rounded-lg"
                                        />
                                    </div>
                                </TabsContent>

                                <Button
                                    type="button"
                                    className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAddContent();
                                    }}
                                    disabled={
                                        uploading ||
                                        (currentTab === "message" &&
                                            !messageText.trim()) ||
                                        ((currentTab === "image" ||
                                            currentTab === "video") &&
                                            !selectedFile) ||
                                        newCapsule.content_items.length >= 10
                                    }
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    {uploading
                                        ? "Uploading..."
                                        : "Add to Capsule"}
                                </Button>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                <Form.Submit asChild>
                    <Button
                        className={`w-full mt-8 py-6 rounded-xl text-white font-semibold text-lg shadow-lg transition-all ${
                            !newCapsule.title ||
                            !newCapsule.description ||
                            newCapsule.content_items.length === 0
                                ? "bg-slate-300"
                                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl"
                        }`}
                        disabled={
                            !newCapsule.title ||
                            !newCapsule.description ||
                            newCapsule.content_items.length === 0
                        }
                    >
                        Create Your Time Capsule
                    </Button>
                </Form.Submit>

                <p className="text-center text-slate-400 text-sm">
                    Your capsule will be sealed until{" "}
                    {date ? format(date, "PPP") : "your selected date"}
                </p>
            </Form.Root>
        </div>
    );
}
