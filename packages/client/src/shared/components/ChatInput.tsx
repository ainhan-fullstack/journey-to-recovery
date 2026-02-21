import type { KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { FaArrowUp } from "react-icons/fa";
import { Button } from "./ui/button";

export type ChatFormData = {
  prompt: string;
};

type Props = {
  onSubmit: (data: ChatFormData) => void;
  disabled?: boolean;
};

const ChatInput = ({ onSubmit, disabled = false }: Props) => {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

  const submit = handleSubmit((data) => {
    reset({ prompt: "" });
    onSubmit(data);
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={submit}
      onKeyDown={handleKeyDown}
      className={`flex flex-col gap-2 items-end border-2 p-4 rounded-3xl ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <textarea
        {...register("prompt", {
          required: true,
          validate: (data) => data.trim().length > 0,
        })}
        autoFocus
        disabled={disabled}
        className="w-full border-0 focus:outline-0 resize-none"
        placeholder={disabled ? "Conversation complete — start a new chat to continue" : "Ask anything"}
        maxLength={1000}
      />
      <Button disabled={!formState.isValid || disabled} className="rounded-full w-9 h-9">
        <FaArrowUp />
      </Button>
    </form>
  );
};

export default ChatInput;
