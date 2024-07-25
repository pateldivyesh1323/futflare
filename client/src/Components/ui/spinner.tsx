import { Spinner as RadixSpinner } from "@radix-ui/themes";

export default function Spinner({ className }: { className?: string }) {
    return (
        <div className={className || "flex justify-center"}>
            <RadixSpinner size="3" />
        </div>
    );
}
