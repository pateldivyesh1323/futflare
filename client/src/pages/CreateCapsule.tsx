import { Button, Heading } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { Capsule } from "../types";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createCapsule } from "../queries";

export default function CreateCapsule() {
    const [newCapsule, setNewCapsule] = useState<Capsule>();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (newCapsule) {
            setNewCapsule({ ...newCapsule, [e.target.name]: e.target.value });
        }
    };

    const { mutate: handleCreateCapsule } = useMutation({
        mutationKey: ["createCapsule"],
        mutationFn: createCapsule,
        onSettled: (data) => {
            console.log(data);
        },
    });

    return (
        <div className="w-[60%] m-auto mb-8">
            <Heading size="6" mb="2" align="center">
                Create new capsule
            </Heading>
            <Form.Root>
                <Form.Field className="grid mb-[10px]" name="title">
                    <div className="flex items-baseline justify-between">
                        <Form.Label className="text-[15px] font-medium leading-[35px]">
                            Title
                        </Form.Label>
                        <Form.Message
                            className="text-[13px] text-white opacity-[0.8]"
                            match="valueMissing"
                        >
                            Please enter title
                        </Form.Message>
                        <Form.Message
                            className="text-[13px] text-white opacity-[0.8]"
                            match="typeMismatch"
                        >
                            Please provide a valid title
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input
                            type="text"
                            className="border"
                            required
                            value={newCapsule?.title}
                            onChange={handleChange}
                        />
                    </Form.Control>
                </Form.Field>
                <Form.Field className="grid mb-[10px]" name="description">
                    <div className="flex items-baseline justify-between">
                        <Form.Label className="text-[15px] font-medium leading-[35px]">
                            Description
                        </Form.Label>
                        <Form.Message
                            className="text-[13px] opacity-[0.8]"
                            match="valueMissing"
                        >
                            Please enter a description
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <textarea
                            className="border"
                            required
                            value={newCapsule?.description}
                            onChange={handleChange}
                        />
                    </Form.Control>
                </Form.Field>
                <Form.Submit asChild>
                    <Button
                        color="yellow"
                        className="float-right!"
                        onClick={() => {
                            console.log("Hello");
                            handleCreateCapsule();
                        }}
                    >
                        Create capsule
                    </Button>
                </Form.Submit>
            </Form.Root>
        </div>
    );
}
